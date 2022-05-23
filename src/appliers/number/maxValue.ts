import {Key, Values, isNumber} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxValue = {
	/** maximum value */
	value: number;

	/** true to adjust if input is greater than "value" / false to error */
	adjusts: boolean;
}
type MaxValueLike = number | MaxValue;

export interface Options
{
	/** maximum value (value or object) */
	maxValue?: MaxValueLike;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<number>
{
	const maxValue = normalizeOptions(options.maxValue);

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

	return ValueSchemaError.raise(CAUSE.MAX_VALUE, values, keyStack);
}

/**
 * normalize options
 * @param maxValue options
 * @returns normalized options
 */
function normalizeOptions(maxValue?: MaxValueLike): MaxValue
{
	const defaultOptions: MaxValue = {
		value: Number.MAX_SAFE_INTEGER,
		adjusts: false,
	};

	if(maxValue === undefined)
	{
		return defaultOptions;
	}
	if(isNumber(maxValue))
	{
		return {
			...defaultOptions,
			value: maxValue,
		};
	}
	return {
		...defaultOptions,
		...maxValue,
	};
}
