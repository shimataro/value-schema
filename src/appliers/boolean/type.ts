import {Key, Values, isBoolean, isNumber, isString} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;

export interface Rules
{
	/** does not convert type; causes error if type does not match */
	strictType?: boolean;
	/** accepts all number value not only 0 and 1 (0 means false, others true) */
	acceptsAllNumbers?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<boolean>
{
	const normalizedRules: Required<Rules> = {
		strictType: false,
		acceptsAllNumbers: false,
		...rules,
	};

	if(isBoolean(values.output))
	{
		// already boolean
		return true;
	}

	// not boolean
	if(normalizedRules.strictType)
	{
		// strict type check
		ValueSchemaError.raise(RULE.TYPE, values, keyStack);
	}

	if(isString(values.output))
	{
		// "true" is true, "false" is false
		if(REGEXP_TRUE.test(values.output))
		{
			values.output = true;
			return true;
		}
		if(REGEXP_FALSE.test(values.output))
		{
			values.output = false;
			return true;
		}

		// convert to number
		values.output = Number(values.output);
	}

	if(isNumber(values.output))
	{
		if(values.output === 0 || values.output === 1 || normalizedRules.acceptsAllNumbers)
		{
			values.output = Boolean(values.output);
			return true;
		}
	}

	return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}
