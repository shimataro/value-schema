import {Key, Values} from "../libs/types";
import {RULE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Rules<T>
{
	/** accepts only specified values */
	only?: readonly T[];
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
	const normalizedRules: Required<Rules<T>> = {
		only: [],
		...rules,
	};

	if(normalizedRules.only.length === 0)
	{
		return false;
	}

	// Array.prototype.include() might not exist in old version
	for(const value of normalizedRules.only)
	{
		if(values.output === value)
		{
			return true;
		}
	}

	return ValueSchemaError.raise(RULE.ONLY, values, keyStack);
}
