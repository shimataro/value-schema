/**
 * Adjuster Error
 */
export default class AdjusterError extends Error
{
	/**
	 * throw an error
	 * @param {string} cause cause of error
	 * @param {DecoratorValues} values original / adjusted values
	 * @param {Key[]} keyStack path to key that caused error
	 * @returns {void}
	 * @throws {AdjusterError}
	 */
	static raise(cause, values, keyStack)
	{
		throw new AdjusterError(cause, values.original, keyStack);
	}

	/**
	 * constructor
	 * @param {string} cause cause of error
	 * @param {*} value original value
	 * @param {Key[]} keyStack path to key that caused error
	 */
	constructor(cause, value, keyStack)
	{
		super(`Adjuster Error: ${cause}; ${value}; ${keyStack}`);

		this.name = "AdjusterError";
		this.cause = cause;
		this.value = value;
		this.keyStack = [...keyStack];
	}
}
