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
	 * check whether error is ValueSchemaError or not
	 * @param err error to check
	 * @returns Yes/No
	 */
	static instances(err: unknown): err is ValueSchemaError
	{
		return err instanceof ValueSchemaError;
	}

	/**
	 * constructor
	 * @param cause cause of error
	 * @param value input value
	 * @param keyStack path to key that caused error
	 */
	constructor(cause: CAUSE, value: unknown, keyStack: Key[])
	{
		super(`${cause}; ${value}; ${keyStack}`);

		this.name = "ValueSchemaError";
		this.cause = cause;
		this.value = value;
		this.keyStack = [...keyStack];
	}
}
