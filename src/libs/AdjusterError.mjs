/**
 * Adjuster Error
 */
export default class AdjusterError extends Error
{
	/**
	 * throw an error
	 * @param {string} cause cause of error
	 * @param {AdjusterBase.VALUES} values original / adjusted values
	 * @returns {void}
	 * @throws {AdjusterError}
	 */
	static raise(cause, values)
	{
		throw new AdjusterError(cause, values.original);
	}

	/**
	 * constructor
	 * @param {string} cause cause of error
	 * @param {*} value original value
	 */
	constructor(cause, value)
	{
		super(`Adjuster Error: ${cause}; ${value}`);

		this.name = "AdjusterError";
		this.cause = cause;
		this.value = value;
		this.key = null;
	}
}
