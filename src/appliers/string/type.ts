import {CAUSE} from "../../libs/enums";
import {Key, Values, isScalar, isString} from "../../libs/types";
import {ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
	strict?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string>
{
	const normalizedOptions: Required<Options> = {
		strict: false,
		...options,
	};

	if(isString(values.output))
	{
		return false;
	}

	// strict check
	if(normalizedOptions.strict)
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	// non-scalar value cannot be converted to string
	if(!isScalar(values.output))
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	values.output = String(values.output);
	return false;
}
