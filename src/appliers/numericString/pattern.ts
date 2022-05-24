import {Key, Values, isString} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

const REGEXP = /^\d+$/;

export interface Options
{
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
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

	return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
}
