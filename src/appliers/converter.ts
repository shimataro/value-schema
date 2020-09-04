import {Key, Values} from "../libs/types";
import {CAUSE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Options<T>
{
	converter?: (value: T, fail: () => never) => T;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T>
{
	if(options.converter === undefined)
	{
		return false;
	}

	values.output = options.converter(values.output as T, () =>
	{
		return ValueSchemaError.raise(CAUSE.CONVERTER, values, keyStack);
	});
	return true;
}
