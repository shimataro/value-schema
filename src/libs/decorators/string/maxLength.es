import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.chain({
		maxLength: _chainMaxLength,
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
 * set max-length
 * @param {Object} params parameters
 * @param {int} length max-length; error if longer
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 */
function _chainMaxLength(params, length, adjust = false)
{
	params.flag = true;
	params.length = length;
	params.adjust = adjust;
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
	if(values.adjusted.length <= params.length)
	{
		return false;
	}

	if(params.adjust)
	{
		values.adjusted = values.adjusted.substr(0, params.length);
		return false;
	}

	const cause = CAUSE.MAX_LENGTH;
	throw new AdjusterError(cause, values.original);
}
