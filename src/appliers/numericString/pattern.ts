import {CAUSE} from "../../libs/enums";
import {Key, Values, isString} from "../../libs/types";
import {ValueSchemaError} from "../../libs/ValueSchemaError";

const REGEXP = /^\d+$/;

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
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(REGEXP.test(values.output))
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.PATTERN, values, keyStack);
}
