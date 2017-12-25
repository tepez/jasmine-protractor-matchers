import { ElementFinder } from 'protractor'
import { ICssValueCompareOptions, IElementLocation, IElementSize } from './types';
import AsyncCustomMatcherResult = jasmine.AsyncCustomMatcherResult;
import * as Tinycolor2 from 'tinycolor2'
import * as Util from 'util'
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
const intersection = require('lodash.intersection');
const difference = require('lodash.difference');


// Add quotes to a string, e.g. str => "str"
function quoteStr(str: string): string {
    return `"${str}"`;
}

export const matchers = {
    toBePresent: function () {
        return {
            compare: (element: ElementFinder): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isPresent().then((isPresent) => {
                        const pass = !!isPresent;
                        ret.message = `Expected ${pass ? 'NOT ' : ''}to be present`;
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toBeDisplayed: function () {
        return {
            compare: (element: ElementFinder): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isDisplayed().then(function (isDisplayed) {
                        const pass = !!isDisplayed;
                        ret.message = `Expected ${pass ? 'NOT ' : ''}to be displayed`;
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toContainText: function () {
        return {
            compare: function (element: ElementFinder, expectedText: string): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText) => {
                        const pass = actualText.indexOf(expectedText.trim()) >= 0;
                        if (pass) {
                            ret.message = `Expected NOT to contain text ${quoteStr(expectedText)}`;
                        } else {
                            ret.message = `Expected to contain text ${quoteStr(expectedText)} BUT text is ${quoteStr(actualText)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveExactText: function () {
        return {
            compare: function (element: ElementFinder, expectedText: string): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText) => {
                        const pass = actualText.trim() === expectedText.trim();
                        if (pass) {
                            ret.message = `Expected NOT to have text ${quoteStr(expectedText)}`;
                        } else {
                            ret.message = `Expected to have text ${quoteStr(expectedText)} BUT has text ${quoteStr(actualText)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveTextMatchedBy: function () {
        return {
            compare: function (element: ElementFinder, pattern): AsyncCustomMatcherResult {
                if (!Util.isRegExp(pattern) && !Util.isString(pattern)) {
                    throw new Error(`toHaveTextMatchedBy expects either a RegExp or a string, given: ${pattern}`)
                }
                if (Util.isString(pattern)) pattern = new RegExp(pattern);

                const ret: AsyncCustomMatcherResult = {
                    pass: element.getText().then((actualText) => {
                        const pass = pattern.test(actualText);
                        if (pass) {
                            ret.message = `Expected NOT to have match ${pattern}`;
                        } else {
                            ret.message = `Expected to match ${pattern}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveValue: function () {
        return {
            compare: (element: ElementFinder, expectedValue: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('value').then((actualValue) => {
                        const pass = actualValue === expectedValue;
                        if (pass) {
                            ret.message = `Expected NOT to have value ${quoteStr(expectedValue)}`;
                        } else {
                            ret.message = `Expected to have value ${quoteStr(expectedValue)} BUT has value ${quoteStr(actualValue)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveAttribute: function () {
        return {
            compare: (element: ElementFinder, attribute: string, expectedValue: string): AsyncCustomMatcherResult => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute(attribute).then((actualValue) => {
                        const pass = actualValue === expectedValue;

                        if (pass) {
                            ret.message = `Expected NOT to have ${attribute} ${quoteStr(expectedValue)}`;
                        } else {
                            ret.message = `Expected to have ${attribute} ${quoteStr(expectedValue)} BUT has ${attribute} ${quoteStr(actualValue)}`;
                        }

                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toMatchAttribute: function () {
        return {
            compare: function (element: ElementFinder, attribute: string, expectedMatch: string | RegExp): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute(attribute).then(function (actualValue) {
                        const regex = new RegExp(expectedMatch);
                        const pass = regex.test(actualValue);
                        if (pass) {
                            ret.message = `Expected ${attribute} NOT to match ${quoteStr(String(regex))}`;
                        } else {
                            ret.message = `Expected ${attribute} to match ${quoteStr(String(regex))} BUT it's value is ${quoteStr(actualValue)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toBeChecked: function () {
        return {
            compare: (element: ElementFinder) => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('checked').then((checked) => {
                        const pass = checked === 'true';
                        ret.message = `Expected ${pass ? ' NOT ' : ''} to be checked`;
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toBeSelected: function () {
        return {
            compare: (element: ElementFinder) => {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.isSelected().then(function (isSelected) {
                        const pass = !!isSelected;
                        ret.message = `Expected ${pass ? ' NOT ' : ''} to be selected`;
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveWidth: function () {
        return {
            compare: function (element: ElementFinder, expectedWidth): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getSize().then(function (size) {
                        const pass = size.width == expectedWidth;
                        if (pass) {
                            ret.message = `Expected NOT to have width ${expectedWidth}`;
                        } else {
                            ret.message = `Expected to have width ${expectedWidth} BUT has width ${size.width}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveSize: function () {
        const sizeToString = (size) => {
            return `Width: ${size.width}, Height: ${size.height}`;
        };

        return {
            compare: function (element: ElementFinder, expectedSize: IElementSize): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getSize().then((actualSize) => {
                        const pass = actualSize.width === expectedSize.width &&
                            actualSize.height === expectedSize.height;
                        if (pass) {
                            ret.message = `Expected NOT to have size ${sizeToString(expectedSize)}`;
                        } else {
                            ret.message = `Expected to have size ${sizeToString(expectedSize)}} BUT has size ${sizeToString(actualSize)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toBeAtLocationX: function () {
        return {
            compare: function (element: ElementFinder, expectedX): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getLocation().then(function (actualLocation) {
                        const pass = actualLocation.x === expectedX;
                        if (pass) {
                            ret.message = `Expected to be at location X ${expectedX} but is at location X ${actualLocation.x}`;
                        } else {
                            ret.message = `Expected NOT to be at location X ${expectedX}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toBeNearLocation: function () {
        // { x: 1, y: 2 } => "(1, 2)"
        function formatCoordinates(obj: IElementLocation) {
            return `(${obj.x}, ${obj.y})`;
        }

        return {
            compare: function (element: ElementFinder, expectedLocation, maxDistance): AsyncCustomMatcherResult {
                maxDistance = Util.isUndefined(maxDistance) ? 2 : maxDistance;
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getLocation().then(function (actualLocation) {
                        const distance = Math.sqrt(
                            Math.pow(actualLocation.x - expectedLocation.x, 2) +
                            Math.pow(actualLocation.y - expectedLocation.y, 2),
                        );

                        const pass = distance <= maxDistance;
                        ret.message = `Expected ${pass ? ' NOT' : ''} to be near ${formatCoordinates(expectedLocation)} but is at ${formatCoordinates((actualLocation))}, ${distance} pixels from it.`;
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },

    toHaveClass: function () {
        return {
            compare: function (element: ElementFinder, expectedClasses: string): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('class').then(function (actualClasses) {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const expectedClassesArr = expectedClasses.split(/\s/);
                        const notSatisfiedClassesArr = difference(expectedClassesArr, actualClassesArr);

                        if (expectedClassesArr.length === 1) {
                            ret.message = `Expected to have class ${expectedClassesArr[0]}`;
                        } else {
                            ret.message = `Expected to have classes ${expectedClassesArr.join(', ')} but does not have classes ${notSatisfiedClassesArr.join(', ')}`;
                        }

                        return notSatisfiedClassesArr.length === 0;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },

            negativeCompare: function (element: ElementFinder, forbiddenClasses: string): AsyncCustomMatcherResult {
                const ret: AsyncCustomMatcherResult = {
                    pass: element.getAttribute('class').then(function (actualClasses) {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const forbiddenClassesArr = forbiddenClasses.split(/\s/);
                        const satisfiedClassesArr = intersection(forbiddenClassesArr, actualClassesArr);

                        if (forbiddenClassesArr.length === 1) {
                            ret.message = `Expected to NOT have class ${forbiddenClassesArr[0]}`;
                        } else {
                            ret.message = `Expected to NOT have classes ${forbiddenClassesArr.join(', ')} but does have classes ${satisfiedClassesArr.join(', ')}`;
                        }
                        return satisfiedClassesArr.length === 0;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },

        };
    },

    toHaveCssValue: function () {
        return {
            compare: function (element: ElementFinder, cssProperty: string, expectedValue: string, options: ICssValueCompareOptions): AsyncCustomMatcherResult {
                if (options && options.normalizeColor) {
                    const parsedColor = Tinycolor2(expectedValue);
                    if (!parsedColor.isValid()) {
                        throw new Error('toHaveCssValue: expected value must be a valid color when using the normalizeColor option');
                    }
                    expectedValue = parsedColor.toHexString();
                }

                const ret: AsyncCustomMatcherResult = {
                    pass: element.getCssValue(cssProperty).then((actualValue) => {
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
                            ret.message = `Expected NOT to have value ${quoteStr(expectedValue)} for CSS property ${cssProperty}`;
                        } else {
                            ret.message = `Expected to have value ${quoteStr(expectedValue)} for CSS property ${cssProperty} BUT has value ${quoteStr(actualValue)}`;
                        }
                        return pass;
                    }) as any as Promise<boolean>,
                };
                return ret;
            },
        };
    },
} as any as CustomMatcherFactories;