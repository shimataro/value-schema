import {Key, Values, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options
{
	pattern?: RegExp;
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
	if(options.pattern === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(options.pattern.test(values.output))
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.PATTERN, values, keyStack);
}
