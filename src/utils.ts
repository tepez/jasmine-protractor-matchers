import AsyncCustomMatcherResult = jasmine.AsyncCustomMatcherResult;


/**
 * Catch errors from matcher and cause the matcher to fail
 *
 * @param ret
 */
export const catchMatcherErrors = (ret: AsyncCustomMatcherResult): AsyncCustomMatcherResult => {
    const passPromise = ret.pass as Promise<boolean>;

    if (!passPromise.catch) return ret;

    ret.pass = passPromise.catch((err) => {
        console.error('Error caught in matcher')
        console.error(err);
        ret.message = err.message;
        return false;
    });

    return ret;
}