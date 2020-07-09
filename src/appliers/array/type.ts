import {Key, Values, isArray, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
	separatedBy?: string | RegExp;
	toArray?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options, keyStack: Key[]): values is Values<T>
{
	if(isArray(values.output))
	{
		// already array
		return false;
	}

	if(isString(values.output) && options.separatedBy !== undefined)
	{
		values.output = values.output.split(options.separatedBy);
		return false;
	}

	if(options.toArray !== undefined && options.toArray)
	{
		values.output = [values.output];
		return false;
	}

	return ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
