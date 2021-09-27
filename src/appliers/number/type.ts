import {Key, Values, isInteger, isNumber, isScalar, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

const REGEXP_NUMBER = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;
const REGEXP_INTEGER = /^\s*[+-]?\d+\s*$/;

export enum INTEGER
{
	/** does not care */
	NO = "no",
	/** must be integer; causes error if otherwise */
	YES = "yes",
	/** rounds down (towards minus infinity) */
	FLOOR = "floor",
	/** rounds towards 0 (away from infinity) */
	FLOOR_RZ = "floor-rounding-towards-zero",
	/** rounds up (towards plus infinity) */
	CEIL = "ceil",
	/** rounds away from 0 (towards infinity) */
	CEIL_RI = "ceil-rounding-towards-infinity",
	/** rounds half up (towards positive infinity) */
	HALF_UP = "rounding-half-up",
	/** rounds half towards zero (away from infinity) */
	HALF_UP_RZ = "rounding-half-up-towards-zero",
	/** rounds half down (towards negative infinity) */
	HALF_DOWN = "rounding-half-down",
	/** rounds half away from zero (towards infinity) */
	HALF_DOWN_RZ = "rounding-half-down-towards-zero",
}

type IntegerLike = boolean | INTEGER;

export interface Options
{
	/** does not convert type; causes error if type does not match */
	strictType?: boolean;
	/** accepts string with special format; e.g., "1e+2", "0x100" */
	acceptsSpecialFormats?: boolean;
	/** needs integer */
	integer?: IntegerLike;
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
	const normalizedOptions: Required<Options> = {
		strictType: false,
		acceptsSpecialFormats: false,
		integer: false,
		...options,
	};

	if(isString(values.output))
	{
		if(!checkNumberFormat(normalizedOptions, values.output))
		{
			ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
		}
	}

	const adjustedValue = toNumber(normalizedOptions, values.output);
	if(adjustedValue === false)
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	values.output = adjustedValue;
	return false;
}

/**
 * check the format of value
 * @param options parameters
 * @param value value to check
 * @returns OK/NG
 */
function checkNumberFormat(options: Required<Options>, value: string): boolean
{
	const re = getRegExpForNumber(options);
	if(re === null)
	{
		return true;
	}
	return re.test(value);
}

/**
 * get RegExp pattern for number
 * @param options parameters
 * @returns regular expression pattern
 */
function getRegExpForNumber(options: Required<Options>): RegExp | null
{
	if(options.acceptsSpecialFormats)
	{
		return null;
	}
	if(options.integer === true || options.integer === INTEGER.YES)
	{
		// integer
		return REGEXP_INTEGER;
	}

	// number
	return REGEXP_NUMBER;
}

/**
 * convert to number
 * @param options parameters
 * @param value value to convert
 * @returns converted value or false(if failed)
 */
function toNumber(options: Required<Options>, value: unknown): number | false
{
	// strict type check
	if(!isNumber(value) && options.strictType)
	{
		return false;
	}

	if(!isScalar(value))
	{
		// not a scalar value
		return false;
	}

	const convertedValue = Number(value);
	if(!isNumber(convertedValue))
	{
		// failed to cast
		return false;
	}

	if(options.integer === false || options.integer === INTEGER.NO)
	{
		return convertedValue;
	}

	// already integer
	if(isInteger(convertedValue))
	{
		return convertedValue;
	}
	if(options.integer === true || options.integer === INTEGER.YES)
	{
		// not an integer and no round-off
		return false;
	}

	return round(convertedValue, options.integer);
}

/**
 * round a value
 * @param value value to round
 * @param method round method
 * @returns rounded value
 */
function round(value: number, method: INTEGER): number | false
{
	if(value >= 0)
	{
		switch(method)
		{
		case INTEGER.FLOOR:
		case INTEGER.FLOOR_RZ:
			return Math.floor(value);

		case INTEGER.CEIL:
		case INTEGER.CEIL_RI:
			return Math.ceil(value);

		case INTEGER.HALF_UP:
		case INTEGER.HALF_UP_RZ:
			return Math.floor(value + 0.5);

		case INTEGER.HALF_DOWN:
		case INTEGER.HALF_DOWN_RZ:
			return Math.ceil(value - 0.5);
		}
	}
	else
	{
		switch(method)
		{
		case INTEGER.FLOOR:
		case INTEGER.CEIL_RI:
			return Math.floor(value);

		case INTEGER.FLOOR_RZ:
		case INTEGER.CEIL:
			return Math.ceil(value);

		case INTEGER.HALF_UP:
		case INTEGER.HALF_DOWN_RZ:
			return Math.floor(value + 0.5);

		case INTEGER.HALF_UP_RZ:
		case INTEGER.HALF_DOWN:
			return Math.ceil(value - 0.5);
		}
	}

	return false;
}
