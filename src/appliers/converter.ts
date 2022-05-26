import {Key, Values} from "../libs/types";
import {RULE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Rules<T>
{
	/** converter function */
	converter?: (value: T, fail: () => never) => T;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, rules: Rules<T>, keyStack: Key[]): values is Values<T>
{
	if(rules.converter === undefined)
	{
		return false;
	}

	values.output = rules.converter(values.output as T, () =>
	{
		return ValueSchemaError.raise(RULE.CONVERTER, values, keyStack);
	});
	return true;
}
