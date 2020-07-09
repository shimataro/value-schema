import {Key, Values, isNumber, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxLength = {
	length: number;
	trims: boolean;
}
type MaxLengthLike = number | MaxLength;

export interface Options
{
	maxLength?: MaxLengthLike;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string>
{
	const maxLength = normalizeOptions(options.maxLength);

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(values.output.length <= maxLength.length)
	{
		return false;
	}
	if(maxLength.trims !== undefined && maxLength.trims)
	{
		values.output = values.output.substr(0, maxLength.length);
		return false;
	}

	return ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
}

/**
 * normalize options
 * @param maxLength options
 * @returns normalized options
 */
function normalizeOptions(maxLength?: MaxLengthLike): MaxLength
{
	const defaultOptions: MaxLength = {
		length: Number.MAX_SAFE_INTEGER,
		trims: false,
	};

	if(maxLength === undefined)
	{
		return defaultOptions;
	}
	if(isNumber(maxLength))
	{
		return {
			...defaultOptions,
			length: maxLength,
		};
	}
	return {
		...defaultOptions,
		...maxLength,
	};
}
