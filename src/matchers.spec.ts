import type { ElementFinder } from 'protractor';
import { ProtractorBrowser } from 'protractor';
import { defaultTimeout, setDefaultTimeout } from './config';
import { matchers } from './matchers'
import CustomAsyncMatcher = jasmine.CustomAsyncMatcher;

type MatcherName =
    | 'toBePresent'
    | 'toBeDisplayed'
    | 'toContainText'
    | 'toHaveExactText'
    | 'toHaveTextMatchedBy'
    | 'toHaveValue'
    | 'toHaveAttribute'
    | 'toMatchAttribute'
    | 'toBeChecked'
    | 'toBeSelected'
    | 'toHaveWidth'
    | 'toHaveSize'
    | 'toHaveClass'
    | 'toBeNearLocation'
    | 'toHaveCssValue'


describe('matchers', () => {
    let matcher: CustomAsyncMatcher;
    let element: Partial<ElementFinder>;

    beforeEach(() => {
        element = {
            locator: () => '[locator]',
        };
    });

    afterEach((): void => {
        matcher = null;
        element = null;
    });


    describe('calling jasmine.addMatchers on the matchers', () => {
        for (const matcherName of [
            'toBePresent',
            'toBeDisplayed',
            'toContainText',
            'toHaveExactText',
            'toHaveTextMatchedBy',
            'toHaveValue',
            'toHaveAttribute',
            'toMatchAttribute',
            'toBeChecked',
            'toBeSelected',
            'toHaveWidth',
            //'toHaveSize',
            // 'toHaveClass',
            'toBeNearLocation',
            'toHaveCssValue',
        ] as MatcherName[]) {
            it(`should add ${matcherName}`, () => {
                expect(expectAsync({})[matcherName]).toBeUndefined();
                jasmine.addAsyncMatchers(matchers);
                expect(expectAsync({})[matcherName]).toEqual(jasmine.any(Function))
            });
        }

        it(`should override the jasmin's default toHaveClass`, () => {
            const orig = expectAsync({}).toHaveClass;
            expect(expectAsync({}).toHaveClass).toBe(orig);
            jasmine.addAsyncMatchers(matchers);
            expect(expectAsync({}).toHaveClass).not.toBe(orig);
        });

        it(`should override the jasmin's default toHaveSize`, () => {
            const orig = expectAsync({}).toHaveSize;
            expect(expectAsync({}).toHaveSize).toBe(orig);
            jasmine.addAsyncMatchers(matchers);
            expect(expectAsync({}).toHaveSize).not.toBe(orig);
        });
    });

    describe('matchers', () => {
        beforeEach(() => {
            (global as any).protractor = {
                browser: {
                    async wait(condition: () => Promise<boolean>): Promise<void> {
                        if (!await condition()) {
                            const error = new Error('Mock Timeout error');
                            error.name = 'TimeoutError';
                            throw error;
                        }
                    },
                } as unknown as ProtractorBrowser,
            };
        });

        const testMatchers = (addSuffix = false): void => {
            const suffix = addSuffix
                ? ' (waited for 5000ms)'
                : '';

            describe('toBePresent()', () => {
                beforeEach(() => {
                    matcher = matchers.toBePresent(null, null);
                });

                describe('when element is present', () => {
                    beforeEach(() => {
                        element.isPresent = jasmine.createSpy('isPresent').and.resolveTo(true);
                    });

                    it('compare', async () => {
                        expect(await matcher.compare(element)).toEqual({
                            pass: true,
                        });
                    });

                    it('negativeCompare', async () => {
                        expect(await matcher.negativeCompare(element)).toEqual({
                            pass: false,
                            message: `Expected [locator] NOT to be present${suffix}`,
                        });
                    });
                });

                describe('when element is NOT present', () => {
                    beforeEach(() => {
                        element.isPresent = jasmine.createSpy('isPresent').and.resolveTo(false);
                    });

                    it('compare', async () => {
                        expect(await matcher.compare(element)).toEqual({
                            pass: false,
                            message: `Expected [locator] to be present${suffix}`,
                        });
                    });

                    it('negativeCompare', async () => {
                        expect(await matcher.negativeCompare(element)).toEqual({
                            pass: true,
                        });
                    });
                });
            });

            describe('toBeDisplayed()', () => {
                beforeEach(() => {
                    matcher = matchers.toBeDisplayed(null, null);
                });

                describe('when element is displayed', () => {
                    beforeEach(() => {
                        element.isDisplayed = jasmine.createSpy('isDisplayed').and.resolveTo(true);
                    });

                    it('compare', async () => {
                        expect(await matcher.compare(element)).toEqual({
                            pass: true,
                        });
                    });

                    it('negativeCompare', async () => {
                        expect(await matcher.negativeCompare(element)).toEqual({
                            pass: false,
                            message: `Expected [locator] NOT to be displayed${suffix}`,
                        });
                    });
                });

                describe('when element is NOT displayed', () => {
                    beforeEach(() => {
                        element.isDisplayed = jasmine.createSpy('isDisplayed').and.resolveTo(false);
                    });

                    it('compare', async () => {
                        expect(await matcher.compare(element)).toEqual({
                            pass: false,
                            message: `Expected [locator] to be displayed${suffix}`,
                        });
                    });

                    it('negativeCompare', async () => {
                        expect(await matcher.negativeCompare(element)).toEqual({
                            pass: true,
                        });
                    });
                });
            });

            describe('toHaveClass', () => {
                beforeEach(() => {
                    element.getAttribute = jasmine.createSpy('getAttribute').and.resolveTo('class1 class2');

                    matcher = matchers.toHaveClass(null, null);
                });

                describe('compare', () => {
                    it('success', async () => {
                        expect(await matcher.compare(element, 'class1 class2')).toEqual({
                            pass: true,
                        });
                    });

                    it('failure', async () => {
                        expect(await matcher.compare(element, 'class1 class3')).toEqual({
                            pass: false,
                            message: `Expected [locator] to have classes [class1, class3] but does not have classes [class3], actual classes are [class1, class2]${suffix}`,
                        });
                    });
                });

                describe('negativeCompare', () => {
                    it('success', async () => {
                        expect(await matcher.negativeCompare(element, 'class3')).toEqual({
                            pass: true,
                        });
                    });

                    it('failure', async () => {
                        expect(await matcher.negativeCompare(element, 'class1')).toEqual({
                            pass: false,
                            message: `Expected [locator] to NOT have class [class1], actual classes are [class1, class2]${suffix}`,
                        });
                    });
                });
            });
        }

        describe('when defaultTimeout is > 0 (default)', () => {
            testMatchers(true);
        });

        describe('when defaultTimeout is 0', () => {
            let origDefaultTimeout: number;

            beforeEach(() => {
                origDefaultTimeout = defaultTimeout;
                setDefaultTimeout(0);
            });

            afterEach(() => {
                setDefaultTimeout(origDefaultTimeout);
            });

            testMatchers();
        });
    });
});