import {CAUSE, NUMERIC_STRING_CHECKSUM} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		checksum: _featureChecksum,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.flag = false;
}

/**
 * validate by checksum
 * @param {Object} params parameters
 * @param {string} algorithm checksum algorithm
 */
function _featureChecksum(params, algorithm)
{
	params.flag = true;
	params.algorithm = algorithm;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	if(check(values.adjusted, params.algorithm))
	{
		return false;
	}

	const cause = CAUSE.NUMERIC_STRING_CHECKSUM;
	throw new AdjusterError(cause, values.original);
}

/**
 * check string
 * @param {string} value value to check
 * @param {string} algorithm check algorithm
 */
function check(value, algorithm)
{
	switch(algorithm)
	{
	case NUMERIC_STRING_CHECKSUM.LUHN:
		return checkLuhn(value);

	default:
		return false;
	}
}

/**
 * check by Luhn algorithm
 * @param {string} value value to check
 * @return {boolean} OK/NG
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
