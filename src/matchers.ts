import { ElementFinder } from 'protractor'
import * as Tinycolor2 from 'tinycolor2'
import * as Util from 'util'
import { ICssValueCompareOptions, IElementLocation, IElementSize } from './types'
import { catchMatcherErrors } from './utils';
import difference = require('lodash.difference');
import intersection = require('lodash.intersection');
import AsyncCustomMatcherResult = jasmine.AsyncCustomMatcherResult;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;


/**
 * Wrap a string to be displayed in an error message so that it will be easy to copy
 * it from the console
 *
 * @param str
 */
function wrapString(str: string): string {
    return `[\n${str}\n]"`;
}


export const matchers = {
    toBePresent: () => {
        return {
            compare: (element: ElementFinder): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isPresent().then((isPresent) => {
                        const pass = !!isPresent;
                        ret.message = `Expected ${pass ? 'NOT ' : ''}to be present`;
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toBeDisplayed: () => {
        return {
            compare: (element: ElementFinder): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isDisplayed().then((isDisplayed: boolean) => {
                        const pass = !!isDisplayed;
                        ret.message = `Expected ${pass ? 'NOT ' : ''}to be displayed`;
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toContainText: () => {
        return {
            compare: (element: ElementFinder, expectedText: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText: string) => {
                        const pass = actualText.indexOf(expectedText.trim()) >= 0;
                        if (pass) {
                            ret.message = `Expected NOT to contain text ${wrapString(expectedText)} BUT text is ${wrapString(actualText)}`;
                        } else {
                            ret.message = `Expected to contain text ${wrapString(expectedText)} BUT text is ${wrapString(actualText)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveExactText: () => {
        return {
            compare: (element: ElementFinder, expectedText: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText: string) => {
                        const pass = actualText.trim() === expectedText.trim();
                        if (pass) {
                            ret.message = `Expected NOT to have text ${wrapString(expectedText)}`;
                        } else {
                            ret.message = `Expected to have text ${wrapString(expectedText)} BUT has text ${wrapString(actualText)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveTextMatchedBy: () => {
        return {
            compare: (element: ElementFinder, pattern: string | RegExp): AsyncCustomMatcherResult => {
                if (!Util.types.isRegExp(pattern) && typeof pattern !== 'string') {
                    throw new Error(`toHaveTextMatchedBy expects either a RegExp or a string, given: ${pattern}`)
                }

                const regex = typeof pattern === 'string'
                    ? new RegExp(pattern)
                    : pattern;

                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText: string) => {
                        const pass = regex.test(actualText);
                        if (pass) {
                            ret.message = `Expected NOT to have match ${pattern}, BUT text is ${wrapString(actualText)}`;
                        } else {
                            ret.message = `Expected to match ${pattern}, BUT text is ${wrapString(actualText)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveValue: () => {
        return {
            compare: (element: ElementFinder, expectedValue: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('value').then((actualValue: string) => {
                        const pass = actualValue === expectedValue;
                        if (pass) {
                            ret.message = `Expected NOT to have value ${wrapString(expectedValue)}`;
                        } else {
                            ret.message = `Expected to have value ${wrapString(expectedValue)} BUT has value ${wrapString(actualValue)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveAttribute: () => {
        return {
            compare: (element: ElementFinder, attribute: string, expectedValue: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute(attribute).then((actualValue: string) => {
                        const pass = actualValue === expectedValue;

                        if (pass) {
                            ret.message = `Expected NOT to have ${attribute} ${wrapString(expectedValue)}`;
                        } else {
                            ret.message = `Expected to have ${attribute} ${wrapString(expectedValue)} BUT has ${attribute} ${wrapString(actualValue)}`;
                        }

                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toMatchAttribute: () => {
        return {
            compare: (element: ElementFinder, attribute: string, expectedMatch: string | RegExp): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute(attribute).then((actualValue: string) => {
                        const regex = new RegExp(expectedMatch);
                        const pass = regex.test(actualValue);
                        if (pass) {
                            ret.message = `Expected ${attribute} NOT to match ${wrapString(String(regex))} BUT it's value is ${wrapString(actualValue)}`;
                        } else {
                            ret.message = `Expected ${attribute} to match ${wrapString(String(regex))} BUT it's value is ${wrapString(actualValue)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toBeChecked: () => {
        return {
            compare: (element: ElementFinder) => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('checked').then((checked: string) => {
                        const pass = checked === 'true';
                        ret.message = `Expected ${pass ? ' NOT ' : ''} to be checked`;
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toBeSelected: () => {
        return {
            compare: (element: ElementFinder) => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isSelected().then((isSelected: boolean) => {
                        const pass = !!isSelected;
                        ret.message = `Expected ${pass ? ' NOT ' : ''} to be selected`;
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveWidth: () => {
        return {
            compare: (element: ElementFinder, expectedWidth: number): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getSize().then((size: IElementSize) => {
                        const pass = size.width == expectedWidth;
                        if (pass) {
                            ret.message = `Expected NOT to have width ${expectedWidth}`;
                        } else {
                            ret.message = `Expected to have width ${expectedWidth} BUT has width ${size.width}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveSize: () => {
        function sizeToString(size: IElementSize): string {
            return `Width: ${size.width}, Height: ${size.height}`;
        }

        return {
            compare: (element: ElementFinder, expectedSize: IElementSize): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getSize().then((actualSize: IElementSize) => {
                        const pass = actualSize.width === expectedSize.width &&
                            actualSize.height === expectedSize.height;
                        if (pass) {
                            ret.message = `Expected NOT to have size ${sizeToString(expectedSize)}`;
                        } else {
                            ret.message = `Expected to have size ${sizeToString(expectedSize)}} BUT has size ${sizeToString(actualSize)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toBeAtLocationX: () => {
        return {
            compare: (element: ElementFinder, expectedX: number): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getLocation().then((actualLocation: IElementLocation) => {
                        const pass = actualLocation.x === expectedX;
                        if (pass) {
                            ret.message = `Expected to be at location X ${expectedX} but is at location X ${actualLocation.x}`;
                        } else {
                            ret.message = `Expected NOT to be at location X ${expectedX}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toBeNearLocation: () => {
        // { x: 1, y: 2 } => "(1, 2)"
        function formatCoordinates(obj: IElementLocation) {
            return `(${obj.x}, ${obj.y})`;
        }

        return {
            compare: (element: ElementFinder, expectedLocation: IElementLocation, maxDistance = 2): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getLocation().then((actualLocation: IElementLocation) => {
                        const distance = Math.sqrt(
                            Math.pow(actualLocation.x - expectedLocation.x, 2) +
                            Math.pow(actualLocation.y - expectedLocation.y, 2),
                        );

                        const pass = distance <= maxDistance;
                        ret.message = `Expected ${pass ? ' NOT' : ''} to be near ${formatCoordinates(expectedLocation)} but is at ${formatCoordinates((actualLocation))}, ${distance} pixels from it.`;
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },

    toHaveClass: () => {
        return {
            compare: (element: ElementFinder, expectedClasses: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('class').then((actualClasses: string) => {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const expectedClassesArr = expectedClasses.split(/\s/);
                        const notSatisfiedClassesArr = difference(expectedClassesArr, actualClassesArr);

                        if (expectedClassesArr.length === 1) {
                            ret.message = `Expected to have class [${expectedClassesArr[0]}], actual classes are [${actualClassesArr.join(', ')}]`;
                        } else {
                            ret.message = `Expected to have classes [${expectedClassesArr.join(', ')}] but does not have classes [${notSatisfiedClassesArr.join(', ')}], actual classes are [${actualClassesArr.join(', ')}]`;
                        }

                        return notSatisfiedClassesArr.length === 0;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },

            negativeCompare: (element: ElementFinder, forbiddenClasses: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('class').then((actualClasses: string) => {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const forbiddenClassesArr = forbiddenClasses.split(/\s/);
                        const satisfiedClassesArr = intersection(forbiddenClassesArr, actualClassesArr);

                        if (forbiddenClassesArr.length === 1) {
                            ret.message = `Expected to NOT have class [${forbiddenClassesArr[0]}], actual classes are [${actualClassesArr.join(', ')}]`;
                        } else {
                            ret.message = `Expected to NOT have classes [${forbiddenClassesArr.join(', ')}] but does have classes [${satisfiedClassesArr.join(', ')}], actual classes are [${actualClassesArr.join(', ')}]`;
                        }
                        return satisfiedClassesArr.length === 0;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },

        };
    },

    toHaveCssValue: () => {
        return {
            compare: (element: ElementFinder, cssProperty: string, expectedValue: string, options: ICssValueCompareOptions): AsyncCustomMatcherResult => {
                if (options && options.normalizeColor) {
                    const parsedColor = Tinycolor2(expectedValue);
                    if (!parsedColor.isValid()) {
                        throw new Error('toHaveCssValue: expected value must be a valid color when using the normalizeColor option');
                    }
                    expectedValue = parsedColor.toHexString();
                }

                const ret: AsyncCustomMatcherResult = {
                    pass: element.getCssValue(cssProperty).then((actualValue: string) => {
                        if (options && options.normalizeColor) {
                            const parsedColor = Tinycolor2(actualValue);
                            if (parsedColor.isValid()) {
                                actualValue = parsedColor.toHexString();
                            } else {
                                console.log(`Warning: toHaveCssValue could not parse color ${actualValue}`);
                            }
                        }

                        const pass = actualValue === expectedValue;
                        if (pass) {
                            ret.message = `Expected NOT to have value ${wrapString(expectedValue)} for CSS property ${cssProperty}`;
                        } else {
                            ret.message = `Expected to have value ${wrapString(expectedValue)} for CSS property ${cssProperty} BUT has value ${wrapString(actualValue)}`;
                        }
                        return pass;
                    }) as Promise<boolean>,
                };
                return catchMatcherErrors(ret);
            },
        };
    },
} as CustomMatcherFactories;