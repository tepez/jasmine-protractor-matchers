import type { ElementFinder } from 'protractor'
import * as Tinycolor2 from 'tinycolor2'
import * as Util from 'util'
import { ICssValueCompareOptions, IElementLocation, IElementSize } from './types'
import { addTimeoutToAsyncMatcher, wrapString } from './utils';
import difference = require('lodash.difference');
import intersection = require('lodash.intersection');


const _matchers: jasmine.CustomAsyncMatcherFactories = {
    toBePresent: () => {
        return {
            compare: async (element: ElementFinder) => {
                const isPresent = await element.isPresent();
                const pass = !!isPresent;
                const message = `Expected ${element.locator()} ${pass ? 'NOT ' : ''}to be present`;
                return {
                    pass,
                    message,
                };
            },
        };
    },

    toBeDisplayed: () => {
        return {
            compare: async (element: ElementFinder) => {
                const isDisplayed = await element.isDisplayed();
                const pass = !!isDisplayed;
                const message = `Expected ${element.locator()} ${pass ? 'NOT ' : ''}to be displayed`;
                return {
                    pass,
                    message,
                };
            },
        };
    },

    toContainText: () => {
        return {
            compare: async (element: ElementFinder, expectedText: string) => {
                let message: string;

                const actualText = await element.getText();
                const pass = actualText.indexOf(expectedText.trim()) >= 0;
                if (pass) {
                    message = `Expected ${element.locator()} NOT to contain text ${wrapString(expectedText)} BUT text is ${wrapString(actualText)}`;
                } else {
                    message = `Expected ${element.locator()} to contain text ${wrapString(expectedText)} BUT text is ${wrapString(actualText)}`;
                }
                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveExactText: () => {
        return {
            compare: async (element: ElementFinder, expectedText: string) => {
                let message: string;

                const actualText = await element.getText();
                const pass = actualText.trim() === expectedText.trim();
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have text ${wrapString(expectedText)}`;
                } else {
                    message = `Expected ${element.locator()} to have text ${wrapString(expectedText)} BUT has text ${wrapString(actualText)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveTextMatchedBy: () => {
        return {
            compare: async (element: ElementFinder, pattern: string | RegExp) => {
                let message: string;

                if (!Util.types.isRegExp(pattern) && typeof pattern !== 'string') {
                    throw new Error(`toHaveTextMatchedBy expects either a RegExp or a string, given: ${pattern}`)
                }

                const regex = typeof pattern === 'string'
                    ? new RegExp(pattern)
                    : pattern;

                const actualText = await element.getText();

                const pass = regex.test(actualText);
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have match ${pattern}, BUT text is ${wrapString(actualText)}`;
                } else {
                    message = `Expected ${element.locator()} to match ${pattern}, BUT text is ${wrapString(actualText)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveValue: () => {
        return {
            compare: async (element: ElementFinder, expectedValue: string) => {
                let message: string;

                const actualValue = await element.getAttribute('value');

                const pass = actualValue === expectedValue;
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have value ${wrapString(expectedValue)}`;
                } else {
                    message = `Expected ${element.locator()} to have value ${wrapString(expectedValue)} BUT has value ${wrapString(actualValue)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveAttribute: () => {
        return {
            compare: async (element: ElementFinder, attribute: string, expectedValue: string) => {
                let message: string;

                const actualValue = await element.getAttribute(attribute);

                const pass = actualValue === expectedValue;
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have ${attribute} ${wrapString(expectedValue)}`;
                } else {
                    message = `Expected ${element.locator()} to have ${attribute} ${wrapString(expectedValue)} BUT has ${attribute} ${wrapString(actualValue)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toMatchAttribute: () => {
        return {
            compare: async (element: ElementFinder, attribute: string, expectedMatch: string | RegExp) => {
                let message: string;

                const actualValue = await element.getAttribute(attribute);

                const regex = new RegExp(expectedMatch);
                const pass = regex.test(actualValue);
                if (pass) {
                    message = `Expected ${attribute} NOT to match ${wrapString(String(regex))} BUT it's value is ${wrapString(actualValue)}`;
                } else {
                    message = `Expected ${attribute} to match ${wrapString(String(regex))} BUT it's value is ${wrapString(actualValue)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toBeChecked: () => {
        return {
            compare: async (element: ElementFinder) => {
                let message: string;

                const checked = await element.getAttribute('checked');

                const pass = checked === 'true';
                message = `Expected ${element.locator()} ${pass ? ' NOT ' : ''} to be checked`;

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toBeSelected: () => {
        return {
            compare: async (element: ElementFinder) => {
                let message: string;

                const isSelected = await element.isSelected();

                const pass = !!isSelected;
                message = `Expected ${element.locator()} ${pass ? ' NOT ' : ''} to be selected`;

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveWidth: () => {
        return {
            compare: async (element: ElementFinder, expectedWidth: number) => {
                let message: string;

                const size = await element.getSize();

                const pass = size.width == expectedWidth;
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have width ${expectedWidth}`;
                } else {
                    message = `Expected ${element.locator()} to have width ${expectedWidth} BUT has width ${size.width}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveSize: () => {
        function sizeToString(size: IElementSize): string {
            return `Width: ${size.width}, Height: ${size.height}`;
        }

        return {
            compare: async (element: ElementFinder, expectedSize: IElementSize) => {
                let message: string;

                const actualSize = await element.getSize();

                const pass = actualSize.width === expectedSize.width &&
                    actualSize.height === expectedSize.height;
                if (pass) {
                    message = `Expected ${element.locator()} NOT to have size ${sizeToString(expectedSize)}`;
                } else {
                    message = `Expected ${element.locator()} to have size ${sizeToString(expectedSize)}} BUT has size ${sizeToString(actualSize)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toBeAtLocationX: () => {
        return {
            compare: async (element: ElementFinder, expectedX: number) => {
                let message: string;

                const actualLocation = await element.getLocation();

                const pass = actualLocation.x === expectedX;
                if (pass) {
                    message = `Expected ${element.locator()} to be at location X ${expectedX} but is at location X ${actualLocation.x}`;
                } else {
                    message = `Expected ${element.locator()} NOT to be at location X ${expectedX}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toBeNearLocation: () => {
        // { x: 1, y: 2 } => "(1, 2)"
        function formatCoordinates(obj: IElementLocation) {
            return `(${obj.x}, ${obj.y})`;
        }

        return {
            compare: async (element: ElementFinder, expectedLocation: IElementLocation, maxDistance = 2) => {
                let message: string;

                const actualLocation = await element.getLocation();

                const distance = Math.sqrt(
                    Math.pow(actualLocation.x - expectedLocation.x, 2) +
                    Math.pow(actualLocation.y - expectedLocation.y, 2),
                );

                const pass = distance <= maxDistance;
                message = `Expected ${element.locator()} ${pass ? ' NOT' : ''} to be near ${formatCoordinates(expectedLocation)} but is at ${formatCoordinates((actualLocation))}, ${distance} pixels from it.`;

                return {
                    pass,
                    message,
                };
            },
        };
    },

    toHaveClass: () => {
        return {
            compare: async (element: ElementFinder, expectedClasses: string) => {
                let message: string;

                const actualClasses = await element.getAttribute('class');

                const actualClassesArr = actualClasses.split(/\s/);
                const expectedClassesArr = expectedClasses.split(/\s/);
                const notSatisfiedClassesArr = difference(expectedClassesArr, actualClassesArr);

                if (expectedClassesArr.length === 1) {
                    message = `Expected ${element.locator()} to have class [${expectedClassesArr[0]}], actual classes are [${actualClassesArr.join(', ')}]`;
                } else {
                    message = `Expected ${element.locator()} to have classes [${expectedClassesArr.join(', ')}] but does not have classes [${notSatisfiedClassesArr.join(', ')}], actual classes are [${actualClassesArr.join(', ')}]`;
                }

                const pass = notSatisfiedClassesArr.length === 0;

                return {
                    pass,
                    message,
                };
            },

            negativeCompare: async (element: ElementFinder, forbiddenClasses: string) => {
                let message: string;

                const actualClasses = await element.getAttribute('class');

                const actualClassesArr = actualClasses.split(/\s/);
                const forbiddenClassesArr = forbiddenClasses.split(/\s/);
                const satisfiedClassesArr = intersection(forbiddenClassesArr, actualClassesArr);

                if (forbiddenClassesArr.length === 1) {
                    message = `Expected ${element.locator()} to NOT have class [${forbiddenClassesArr[0]}], actual classes are [${actualClassesArr.join(', ')}]`;
                } else {
                    message = `Expected ${element.locator()} to NOT have classes [${forbiddenClassesArr.join(', ')}] but does have classes [${satisfiedClassesArr.join(', ')}], actual classes are [${actualClassesArr.join(', ')}]`;
                }
                const pass = satisfiedClassesArr.length === 0;

                return {
                    pass,
                    message,
                };
            },

        };
    },

    toHaveCssValue: () => {
        return {
            compare: async (element: ElementFinder, cssProperty: string, expectedValue: string, options: ICssValueCompareOptions) => {
                let message: string;

                if (options && options.normalizeColor) {
                    const parsedColor = Tinycolor2(expectedValue);
                    if (!parsedColor.isValid()) {
                        throw new Error('toHaveCssValue: expected value must be a valid color when using the normalizeColor option');
                    }
                    expectedValue = parsedColor.toHexString();
                }

                let actualValue = await element.getCssValue(cssProperty);

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
                    message = `Expected ${element.locator()} NOT to have value ${wrapString(expectedValue)} for CSS property ${cssProperty}`;
                } else {
                    message = `Expected ${element.locator()} to have value ${wrapString(expectedValue)} for CSS property ${cssProperty} BUT has value ${wrapString(actualValue)}`;
                }

                return {
                    pass,
                    message,
                };
            },
        };
    },
};

export const matchers: jasmine.CustomAsyncMatcherFactories = {};
for (const [name, matcher] of Object.entries(_matchers)) {
    matchers[name] = addTimeoutToAsyncMatcher(matcher);
}