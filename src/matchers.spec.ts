import { matchers } from './matchers'


interface ISpec {
    matcher: any
    element: any
}

type MatcherName = 'toBePresent'
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
    let spec: ISpec;
    afterEach((): void => spec = null);
    beforeEach(function (this: ISpec) {
        spec = this;
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
            'toHaveSize',
            // 'toHaveClass',
            'toBeNearLocation',
            'toHaveCssValue',
        ] as MatcherName[]) {
            it(`should add ${matcherName}`, () => {
                expect(expect({})[matcherName]).toBeUndefined();
                jasmine.addMatchers(matchers);
                expect(expect({})[matcherName]).toEqual(jasmine.any(Function))
            });
        }

        it('should override the jasmin\'s default toHaveClass', () => {
            const orig = expect({}).toHaveClass;
            expect(expect({}).toHaveClass).toBe(orig);
            jasmine.addMatchers(matchers);
            expect(expect({}).toHaveClass).not.toBe(orig);
        });
    });

    describe('toBePresent()', () => {
        beforeEach(() => {
            spec.matcher = matchers.toBePresent(null, null);
        });

        it('element is present', async () => {
            spec.element = {
                isPresent: jasmine.createSpy('isPresent').and.returnValue(Promise.resolve(true)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            const resolvedPass = await ret.pass;
            expect(resolvedPass).toBe(true);
            expect(ret.message).toBe('Expected NOT to be present')
        });

        it('element is NOT present', async () => {
            spec.element = {
                isPresent: jasmine.createSpy('isPresent').and.returnValue(Promise.resolve(false)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            const resolvedPass = await ret.pass;
            expect(resolvedPass).toBe(false);
            expect(ret.message).toBe('Expected to be present')
        });
    });

    describe('toBeDisplayed()', () => {
        beforeEach(() => {
            spec.matcher = matchers.toBeDisplayed(null, null);
        });

        it('element is present', async () => {
            spec.element = {
                isDisplayed: jasmine.createSpy('isDisplayed').and.returnValue(Promise.resolve(true)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            const resolvedPass = await ret.pass;
            expect(resolvedPass).toBe(true);
            expect(ret.message).toBe('Expected NOT to be displayed')
        });

        it('element is NOT present', async () => {
            spec.element = {
                isDisplayed: jasmine.createSpy('isDisplayed').and.returnValue(Promise.resolve(false)),
            } as any;

            const ret = spec.matcher.compare(spec.element);
            expect(ret).toEqual({
                pass: jasmine.any(Promise),
            });
            const resolvedPass = await ret.pass;
            expect(resolvedPass).toBe(false);
            expect(ret.message).toBe('Expected to be displayed')
        });
    });
});