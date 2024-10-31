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
        interface AsyncMatchers<T, U> {
            toBePresent(): Promise<boolean>

            toBeDisplayed(): Promise<boolean>

            toContainText(expectedText: string): Promise<boolean>

            toHaveExactText(expectedText: string): Promise<boolean>

            toHaveTextMatchedBy(pattern: string | RegExp): Promise<boolean>

            toHaveValue(expectedValue: string): Promise<boolean>

            toHaveAttribute(attribute: string, expectedValue: string): Promise<boolean>

            toMatchAttribute(attribute: string, expectedValue: string | RegExp): Promise<boolean>

            toBeChecked(): Promise<boolean>

            toBeSelected(): Promise<boolean>

            toHaveWidth(expectedWidth: number): Promise<boolean>

            toHaveSize(expectedSize: { width: number, height: number }): Promise<boolean>

            toHaveClass(expectedClasses: string): Promise<boolean>

            toBeAtLocationX(expectedX: number): Promise<boolean>

            toBeNearLocation(expectedLocation: IElementLocation, maxDistance?: number): Promise<boolean>

            toHaveCssValue(toHaveCssValue: string, expectedValue: string, options?: ICssValueCompareOptions): Promise<boolean>
        }
    }
}
