import {Key, Values, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export enum CHECKSUM_ALGORITHM
{
	LUHN = "luhn",
	CREDIT_CARD = LUHN,

	MODULUS10_WEIGHT3_1 = "modulus10/weight3:1",
	ISBN13 = MODULUS10_WEIGHT3_1,
	EAN = MODULUS10_WEIGHT3_1,
	JAN = MODULUS10_WEIGHT3_1,
}

export interface Options
{
	checksum?: CHECKSUM_ALGORITHM;
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
	if(options.checksum === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(check(values.output, options.checksum))
	{
		return false;
	}

	return ValueSchemaError.raise(CAUSE.CHECKSUM, values, keyStack);
}

/**
 * check string
 * @param value value to check
 * @param algorithm check algorithm
 * @returns OK/NG
 */
function check(value: string, algorithm: CHECKSUM_ALGORITHM): boolean
{
	switch(algorithm)
	{
	case CHECKSUM_ALGORITHM.LUHN:
		return checkLuhn(value);

	case CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1:
		return checkModulus10Weight31(value);

	default:
		return false;
	}
}

/**
 * check by Luhn algorithm (used by credit card)
 * @param value value to check
 * @returns OK/NG
 */
function checkLuhn(value: string): boolean
{
	const {length} = value;
	let sum = 0;
	for(let index = length - 1; index >= 0; index -= 2)
	{
		// odd columns
		sum += Number(value[index]);
	}
	for(let index = length - 2; index >= 0; index -= 2)
	{
		// even columns
		const num = Number(value[index]) * 2;
		sum += num % 10;
		sum += Math.floor(num / 10);
	}

	return sum % 10 === 0;
}

/**
 * check by Modulus 10 / Weight 3:1 algorithm (used by ISBN/EAN/JAN)
 * @param value value to check
 * @returns OK/NG
 */
function checkModulus10Weight31(value: string): boolean
{
	const {length} = value;
	let sum = 0;
	for(let index = 0; index < length - 1; index += 2)
	{
		sum += Number(value[index]);
	}
	for(let index = 1; index < length - 1; index += 2)
	{
		sum += Number(value[index]) * 3;
	}

	const mod = sum % 10;
	return (10 - mod) % 10 === Number(value[length - 1]);
}
