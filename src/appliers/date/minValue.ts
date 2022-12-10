import {isDate, Key, Values} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MinValue = {
	/** minimum value */
	value: Date;

	/** true to adjust if input is less than "value" / false to error */
	adjusts: boolean;
};
type MinValueLike = Date | MinValue;

export interface Rules
{
	/** minimum value (value or object) */
	minValue?: MinValueLike;
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
	if(rules.minValue === undefined)
	{
		return false;
	}

	const minValue = normalizeRules(rules.minValue);

	if(!isDate(values.output))
	{
		return false;
	}

	if(values.output.getTime() >= minValue.value.getTime())
	{
		return false;
	}
	if(minValue.adjusts)
	{
		values.output = minValue.value;
		return false;
	}

	return ValueSchemaError.raise(RULE.MIN_VALUE, values, keyStack);
}

/**
 * normalize rules
 * @param minValueLike minimum value
 * @returns normalized rules
 */
function normalizeRules(minValueLike: MinValueLike): MinValue
{
	if(isDate(minValueLike))
	{
		return {
			adjusts: false,
			value: minValueLike,
		};
	}
	return minValueLike;
}
