/**
 * A function that does nothing. Useful as a safe default callback.
 *
 * @example
 * const onClick = noop;
 * button.addEventListener('click', noop);
 */
export function noop(..._args: unknown[]): void {}

/**
 * An async noop that returns a resolved Promise.
 *
 * @example
 * const onSubmit: () => Promise<void> = asyncNoop;
 */
export async function asyncNoop(..._args: unknown[]): Promise<void> {}
