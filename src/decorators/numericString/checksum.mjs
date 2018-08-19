import {CAUSE, NUMERIC_STRING} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		checksum: _featureChecksum,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * validate by checksum
 * @param {Object} params parameters
 * @param {string} algorithm checksum algorithm
 * @returns {void}
 */
function _featureChecksum(params, algorithm)
{
	params.flag = true;
	params.algorithm = algorithm;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(!params.flag)
	{
		return false;
	}
	if(check(values.adjusted, params.algorithm))
	{
		return false;
	}

	AdjusterError.raise(CAUSE.CHECKSUM, values, keyStack);
}

/**
 * check string
 * @param {string} value value to check
 * @param {string} algorithm check algorithm
 * @returns {boolean} OK/NG
 */
function check(value, algorithm)
{
	switch(algorithm)
	{
	case NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN:
		return checkLuhn(value);

	case NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1:
		return checkModulus10Weight31(value);

	default:
		return false;
	}
}

/**
 * check by Luhn algorithm (used by credit card)
 * @param {string} value value to check
 * @returns {boolean} OK/NG
 */
function checkLuhn(value)
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
 * @param {string} value value to check
 * @returns {boolean} OK/NG
 */
function checkModulus10Weight31(value)
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
