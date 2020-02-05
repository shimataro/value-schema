import {CAUSE} from "./constants";
import {Key, Values} from "./types";

/**
 * Value-Schema Error
 */
export class ValueSchemaError extends Error
{
	public cause: CAUSE;
	public value: unknown;
	public keyStack: Key[];

	/**
	 * throw an error
	 * @param cause cause of error
	 * @param values input/output values
	 * @param keyStack path to key that caused error
	 * @throws {ValueSchemaError}
	 */
	static raise(cause: CAUSE, values: Values, keyStack: Key[]): never
	{
		throw new ValueSchemaError(cause, values.input, keyStack);
	}

	/**
	 * constructor
	 * @param cause cause of error
	 * @param inputValue input value
	 * @param keyStack path to key that caused error
	 */
	constructor(cause: CAUSE, inputValue: unknown, keyStack: Key[])
	{
		super(`${cause}; ${inputValue}; ${keyStack}`);

		this.name = "ValueSchemaError";
		this.cause = cause;
		this.value = inputValue;
		this.keyStack = [...keyStack];
	}
}
