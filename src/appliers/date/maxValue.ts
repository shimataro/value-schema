import {Key, Values, isDate} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxValue = {
	/** maximum value */
	value: Date;

	/** true to adjust if input is less than "value" / false to error */
	adjusts: boolean;
};
type MaxValueLike = Date | MaxValue;

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
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date>
{
	if(rules.maxValue === undefined)
	{
		return false;
	}

	const maxValue = normalizeRules(rules.maxValue);

	if(!isDate(values.output))
	{
		return false;
	}

	if(values.output.getTime() <= maxValue.value.getTime())
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
 * @param maxValueLike maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValueLike: MaxValueLike): MaxValue
{
	if(isDate(maxValueLike))
	{
		return {
			adjusts: false,
			value: maxValueLike,
		};
	}
	return maxValueLike;
}
