import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

const NAME = "default";

export default AdjusterBase.decoratorBuilder(NAME, _adjust)
	.init(_init)
	.chain(_chain)
	.build();

/**
 * init
 * @param {AdjusterBase.PARAMS} params parameters
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set default value
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {*} value default value
 */
function _chain(params, value)
{
	params.flag = true;
	params.value = value;
}

/**
 * adjuster
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(values.adjusted !== undefined)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.value;
		return true;
	}

	const cause = CAUSE.REQUIRED;
	throw new AdjusterError(cause, values.original);
}
