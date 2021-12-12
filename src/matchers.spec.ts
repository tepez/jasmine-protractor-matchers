import { ElementFinder } from 'protractor';
import { setDefaultTimeout } from './config';
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
        setDefaultTimeout(0);
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

    describe('toBePresent()', () => {
        beforeEach(() => {
            matcher = matchers.toBePresent(null, null);
        });

        it('element is present', async () => {
            element.isPresent = jasmine.createSpy('isPresent').and.resolveTo(true);

            expect(await matcher.compare(element)).toEqual({
                pass: true,
                message: 'Expected [locator] NOT to be present',
            });
        });

        it('element is NOT present', async () => {
            element.isPresent = jasmine.createSpy('isPresent').and.resolveTo(false);

            expect(await matcher.compare(element)).toEqual({
                pass: false,
                message: 'Expected [locator] to be present',
            });
        });
    });

    describe('toBeDisplayed()', () => {
        beforeEach(() => {
            matcher = matchers.toBeDisplayed(null, null);
        });

        it('element is present', async () => {
            element.isDisplayed = jasmine.createSpy('isDisplayed').and.resolveTo(true);

            expect(await matcher.compare(element)).toEqual({
                pass: true,
                message: 'Expected [locator] NOT to be displayed',
            });
        });

        it('element is NOT present', async () => {
            element.isDisplayed = jasmine.createSpy('isDisplayed').and.resolveTo(false);

            expect(await matcher.compare(element)).toEqual({
                pass: false,
                message: 'Expected [locator] to be displayed',
            });
        });
    });
});