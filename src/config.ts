export let defaultTimeout = 5000;

/**
 * Update the default timeout allowed for all matchers to pass
 *
 * @param newTimeout
 */
export function setDefaultTimeout(newTimeout: number): void {
    defaultTimeout = newTimeout;
}