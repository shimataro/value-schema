import {Key, Values, isObject} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options, keyStack: Key[]): values is Values<T> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	if(isObject(values.output))
	{
		// already object
		return false;
	}

	return ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
