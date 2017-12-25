import { matchers } from './matchers'
import { before } from 'selenium-webdriver/testing'
import CustomMatcher = jasmine.CustomMatcher
import { ElementFinder } from 'protractor'


interface ISpec {
    matcher: any
    element: any
}

describe('matchers', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    describe('calling jasmine.addMatchers on the matchers', () => {
        [
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
            'toHaveSize',
            'toHaveClass',
            'toBeNearLocation',
            'toHaveCssValue',
        ].forEach((matcherName) => {
            it(`should add ${matcherName}`, () => {
                expect(expect({})[matcherName]).toBeUndefined();
                jasmine.addMatchers(matchers);
                expect(expect({})[matcherName]).toEqual(jasmine.any(Function))
            });
        });
    });

    describe('toBePresent()', () => {
        beforeEach(() => {
            spec.matcher = matchers.toBePresent(null, null);
        });

        it('element is present', (done) => {
            spec.element = {
                isPresent: jasmine.createSpy('isPresent').and.returnValue(Promise.resolve(true)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            ret.pass.then((resolvedPass) => {
                expect(resolvedPass).toBe(true);
                expect(ret.message).toBe('Expected NOT to be present')
            }).then(done, done.fail);
        });

        it('element is NOT present', (done) => {
            spec.element = {
                isPresent: jasmine.createSpy('isPresent').and.returnValue(Promise.resolve(false)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            ret.pass.then((resolvedPass) => {
                expect(resolvedPass).toBe(false);
                expect(ret.message).toBe('Expected to be present')
            }).then(done, done.fail);
        });
    });

    describe('toBeDisplayed()', () => {
        beforeEach(() => {
            spec.matcher = matchers.toBeDisplayed(null, null);
        });

        it('element is present', (done) => {
            spec.element = {
                isDisplayed: jasmine.createSpy('isDisplayed').and.returnValue(Promise.resolve(true)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            ret.pass.then((resolvedPass) => {
                expect(resolvedPass).toBe(true);
                expect(ret.message).toBe('Expected NOT to be displayed')
            }).then(done, done.fail);
        });

        it('element is NOT present', (done) => {
            spec.element = {
                isDisplayed: jasmine.createSpy('isDisplayed').and.returnValue(Promise.resolve(false)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            ret.pass.then((resolvedPass) => {
                expect(resolvedPass).toBe(false);
                expect(ret.message).toBe('Expected to be displayed')
            }).then(done, done.fail);
        });
    });
});