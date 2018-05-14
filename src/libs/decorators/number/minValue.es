import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const NAME = "minValue";

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
 * set min-value
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _chain(params, value, adjust = false)
{
	params.flag = true;
	params.value = value;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {AdjusterBase.PARAMS} params parameters
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
	if(values.adjusted >= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjusted = params.value;
		return false;
	}

	const cause = CAUSE.MIN_VALUE;
	throw new AdjusterError(cause, values.original);
}
