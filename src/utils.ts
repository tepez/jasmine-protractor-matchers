import { browser } from 'protractor';
import { defaultTimeout } from './config';
import CustomAsyncMatcher = jasmine.CustomAsyncMatcher;
import CustomAsyncMatcherFactory = jasmine.CustomAsyncMatcherFactory;
import CustomMatcherResult = jasmine.CustomMatcherResult;
import MatchersUtil = jasmine.MatchersUtil;


/**
 * Wrap a string to be displayed in an error message so that it will be easy to copy
 * it from the console
 *
 * @param str
 */
export function wrapString(str: string): string {
    return `[\n${str}\n]"`;
}

function isTimeoutError(err: Error): boolean {
    return err.name === 'TimeoutError';
}

type AsyncCompare = CustomAsyncMatcher['compare'] | CustomAsyncMatcher['negativeCompare']

function wrapCompareFunction(
    origCompare: AsyncCompare,
    negate = false,
): AsyncCompare {
    return async function (arg1: any, ...args: any[]) {
        if (!defaultTimeout) {
            const result = await origCompare(arg1, ...args);
            if (negate) result.pass = !result.pass
            if (result.pass) delete result.message;
            return result;
        }

        let lastResult: CustomMatcherResult = {
            message: `Matcher didn't run. This should not happen.`,
            pass: false,
        }
        try {
            await browser.wait(async () => {
                lastResult = await origCompare(arg1, ...args);
                if (negate) lastResult.pass = !lastResult.pass;
                return lastResult.pass;
            }, defaultTimeout);
            return lastResult.pass
                ? {
                    pass: true,
                }
                : lastResult;
        } catch (err) {
            if (isTimeoutError(err)) {
                lastResult.message += ` (waited for ${defaultTimeout}ms)`;
                return lastResult;
            } else {
                throw err;
            }
        }
    };
}

export function addTimeoutToAsyncMatcher(factory: CustomAsyncMatcherFactory): CustomAsyncMatcherFactory {
    return (
        util: MatchersUtil,
    ) => {
        const matcher = factory(util);
        return {
            compare: wrapCompareFunction(matcher.compare, false),
            negativeCompare: matcher.negativeCompare
                ? wrapCompareFunction(matcher.negativeCompare)
                : wrapCompareFunction(matcher.compare, true),
        };
    }
}