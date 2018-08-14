/**
 * Adjuster Error
 */
export default class AdjusterError extends Error
{
	/**
	 * throw an error
	 * @param {string} cause cause of error
	 * @param {AdjusterBase.VALUES} values original / adjusted values
	 * @param {(string|number)[]} stack error keys stack
	 * @returns {void}
	 * @throws {AdjusterError}
	 */
	static raise(cause, values, stack)
	{
		throw new AdjusterError(cause, values.original, stack);
	}

	/**
	 * constructor
	 * @param {string} cause cause of error
	 * @param {*} value original value
	 * @param {(string|number)[]} stack error keys stack
	 */
	constructor(cause, value, stack)
	{
		super(`Adjuster Error: ${cause}; ${value}; ${stack}`);

		this.name = "AdjusterError";
		this.cause = cause;
		this.value = value;
		this.stack = [...stack];
	}
}
