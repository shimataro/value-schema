import {Key, Values, isNumber} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MinValue = {
	/** minimum value */
	value: number;

	/** true to adjust if input is less than "value" / false to error */
	adjusts: boolean;
}
type MinValueLike = number | MinValue;

export interface Options
{
	/** minimum value (value or object) */
	minValue?: MinValueLike;
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
	const minValue = normalizeOptions(options.minValue);

	// istanbul ignore next
	if(!isNumber(values.output))
	{
		return false;
	}

	if(values.output >= minValue.value)
	{
		return false;
	}
	if(minValue.adjusts)
	{
		values.output = minValue.value;
		return false;
	}

	return ValueSchemaError.raise(CAUSE.MIN_VALUE, values, keyStack);
}

/**
 * normalize options
 * @param minValue options
 * @returns normalized options
 */
function normalizeOptions(minValue?: MinValueLike): MinValue
{
	const defaultOptions: MinValue = {
		value: Number.MIN_SAFE_INTEGER,
		adjusts: false,
	};

	if(minValue === undefined)
	{
		return defaultOptions;
	}
	if(isNumber(minValue))
	{
		return {
			...defaultOptions,
			value: minValue,
		};
	}
	return {
		...defaultOptions,
		...minValue,
	};
}
