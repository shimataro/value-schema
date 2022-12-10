import {Key, Values, isObject} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Rules
{
}

/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, _rules: Rules, keyStack: Key[]): values is Values<T>
{
	if(isObject(values.output))
	{
		// already object
		return false;
	}

	return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}
