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
 * set max-length of array
 * @param {Object} params parameters
 * @param {int} length min-length; error if shorter
 * @param {boolean} adjust adjust value or not
 * @return {void}
 */
function _featureMaxLength(params, length, adjust = false)
{
	params.flag = true;
	params.length = length;
	params.adjust = adjust;
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
	if(values.adjusted.length <= params.length)
	{
		return false;
	}

	if(params.adjust)
	{
		values.adjusted.splice(params.length);
		return false;
	}

	const cause = CAUSE.MAX_LENGTH;
	throw new AdjusterError(cause, values.original);
}
