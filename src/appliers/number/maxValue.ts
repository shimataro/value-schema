import {Key, Values, isNumber} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxValue = {
	value: number;
	adjusts: boolean;
}
type MaxValueLike = number | MaxValue;

export interface Options
{
	maxValue?: MaxValueLike;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
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

	ValueSchemaError.raise(CAUSE.MAX_VALUE, values, keyStack);
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
