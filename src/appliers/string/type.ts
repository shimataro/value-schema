import {CAUSE} from "../../libs/enums";
import {Key, Values, isScalar, isString} from "../../libs/types";
import {ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
	strictType?: boolean;
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
		strictType: false,
		...options,
	};

	if(isString(values.output))
	{
		return false;
	}

	// strict type check
	if(normalizedOptions.strictType)
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
