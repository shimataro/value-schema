import {Key, Values} from "../libs/types";
import {RULE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Rules<T>
{
	/** value if empty string (defaults: error) */
	ifEmptyString?: T | null;
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
	if(values.output !== "")
	{
		return false;
	}

	if(rules.ifEmptyString !== undefined)
	{
		values.output = rules.ifEmptyString;
		return true;
	}

	return ValueSchemaError.raise(RULE.EMPTY_STRING, values, keyStack);
}
