/**
 * Value-Schema Error
 */
export default class ValueSchemaError extends Error
{
	/**
	 * throw an error
	 * @param {string} cause cause of error
	 * @param {Decorator-Values} values original / fitted values
	 * @param {Key[]} keyStack path to key that caused error
	 * @returns {void}
	 * @throws {ValueSchemaError}
	 */
	static raise(cause, values, keyStack)
	{
		throw new ValueSchemaError(cause, values.original, keyStack);
	}

	/**
	 * constructor
	 * @param {string} cause cause of error
	 * @param {*} value original value
	 * @param {Key[]} keyStack path to key that caused error
	 */
	constructor(cause, value, keyStack)
	{
		super(`${cause}; ${value}; ${keyStack}`);

		this.name = "ValueSchemaError";
		this.cause = cause;
		this.value = value;
		this.keyStack = [...keyStack];
	}
}
