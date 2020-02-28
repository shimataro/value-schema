import {Key, Values, isArray} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
	minLength?: number;
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
	const normalizedOptions: Required<Options> = {
		minLength: 0,
		...options,
	};

	// istanbul ignore next
	if(!isArray(values.output))
	{
		return false;
	}

	if(values.output.length >= normalizedOptions.minLength)
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.MIN_LENGTH, values, keyStack);
}
