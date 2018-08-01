import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		minLength: _featureMinLength,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-length of array
 * @param {Object} params parameters
 * @param {number} length max-length
 * @return {void}
 */
function _featureMinLength(params, length)
{
	params.flag = true;
	params.length = length;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjusted.length >= params.length)
	{
		return false;
	}

	const cause = CAUSE.MIN_LENGTH;
	throw new AdjusterError(cause, values.original);
}
