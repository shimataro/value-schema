import {Key, Values} from "../libs/types";
import {RULE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Rules<T>
{
	/** transformer function */
	transform?: (value: T, fail: () => never) => T;
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
	if(rules.transform === undefined)
	{
		return false;
	}

	values.output = rules.transform(values.output as T, () =>
	{
		return ValueSchemaError.raise(RULE.TRANSFORM, values, keyStack);
	});
	return true;
}
