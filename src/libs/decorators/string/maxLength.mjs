import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		maxLength: _featureMaxLength,
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
 * set max-length
 * @param {Object} params parameters
 * @param {number} length max-length; error if longer
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 * @return {void}
 */
function _featureMaxLength(params, length, adjust = false)
{
	params.flag = true;
	params.length = length;
	params.adjust = adjust;
}

/**
 * adjust
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
	if(values.adjusted.length <= params.length)
	{
		return false;
	}

	if(params.adjust)
	{
		values.adjusted = values.adjusted.substr(0, params.length);
		return false;
	}

	AdjusterError.raise(CAUSE.MAX_LENGTH, values);
}
