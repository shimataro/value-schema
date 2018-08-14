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
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-length
 * @param {Object} params parameters
 * @param {number} length min-length; error if shorter
 * @returns {void}
 */
function _featureMinLength(params, length)
{
	params.flag = true;
	params.length = length;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} stack error keys stack
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, stack)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjusted.length >= params.length)
	{
		return false;
	}

	AdjusterError.raise(CAUSE.MIN_LENGTH, values, stack);
}
