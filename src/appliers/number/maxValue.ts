import {Key, Values, isNumber} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxValue = {
	/** maximum value */
	value: number;

	/** true to adjust if input is greater than "value" / false to error */
	adjusts: boolean;
}
type MaxValueLike = number | MaxValue;

export interface Rules
{
	/** maximum value (value or object) */
	maxValue?: MaxValueLike;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<number>
{
	const maxValue = normalizeRules(rules.maxValue);

	// istanbul ignore next
	if(!isNumber(values.output))
	{
		return false;
	}

	if(values.output <= maxValue.value)
	{
		return false;
	}
	if(maxValue.adjusts)
	{
		values.output = maxValue.value;
		return false;
	}

	return ValueSchemaError.raise(RULE.MAX_VALUE, values, keyStack);
}

/**
 * normalize rules
 * @param maxValue maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValue?: MaxValueLike): MaxValue
{
	const defaultRules: MaxValue = {
		value: Number.MAX_SAFE_INTEGER,
		adjusts: false,
	};

	if(maxValue === undefined)
	{
		return defaultRules;
	}
	if(isNumber(maxValue))
	{
		return {
			...defaultRules,
			value: maxValue,
		};
	}
	return {
		...defaultRules,
		...maxValue,
	};
}
