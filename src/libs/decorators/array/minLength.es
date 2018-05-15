import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const NAME = "minLength";

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
 * @param {int} length max-length
 */
function _chain(params, length)
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
