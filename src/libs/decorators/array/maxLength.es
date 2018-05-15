import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const NAME = "maxLength";

export default AdjusterBase.decoratorBuilder(NAME, _adjust)
	.init(_init)
	.chain(_chain)
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
 * set default value
 * @param {Object} params parameters
 * @param {int} length min-length; error if shorter
 */
function _chain(params, length, adjust = false)
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
