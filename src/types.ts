export interface ICssValueCompareOptions {
    normalizeColor: boolean
}

export interface IElementSize {
    width: number
    height: number
}

export interface IElementLocation {
    x: number,
    y: number
}

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBePresent(): boolean

            toBeDisplayed(): boolean

            toContainText(expectedText: string): boolean

            toHaveExactText(expectedText: string): boolean

            toHaveTextMatchedBy(pattern: string | RegExp): boolean

            toHaveValue(expectedValue: string): boolean

            toHaveAttribute(attribute: string, expectedValue: string): boolean

            toMatchAttribute(attribute: string, expectedValue: string): boolean

            toBeChecked(): boolean

            toBeSelected(): boolean

            toHaveWidth(expectedWidth: number): boolean

            toHaveSize(expectedSize: { width: number, height: number }): boolean

            toHaveClass(expectedClasses: string): boolean

            toBeNearLocation(expectedLocation: IElementLocation, maxDistance?: number)

            toHaveCssValue(toHaveCssValue: string, expectedValue: string, options?: ICssValueCompareOptions): boolean
        }
    }
}
