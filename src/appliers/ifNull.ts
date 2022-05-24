import {Key, Values} from "../libs/types";
import {RULE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Options<T>
{
	/** value if null (defaults: error) */
	ifNull?: T | null;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T>
{
	if(values.output !== null)
	{
		return false;
	}

	if(options.ifNull !== undefined)
	{
		values.output = options.ifNull;
		return true;
	}

	return ValueSchemaError.raise(RULE.NULL, values, keyStack);
}
