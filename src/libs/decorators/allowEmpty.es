import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

const NAME = "allowEmpty";

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
 * allow empty string; will be adjusted to 0
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {*} [value=null] value on empty
 */
function _chain(params, value = null)
{
	params.flag = true;
	params.valueOnEmpty = value;
}

/**
 * adjust
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(values.adjusted !== "")
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnEmpty;
		return true;
	}

	const cause = CAUSE.EMPTY;
	throw new AdjusterError(cause, values.original);
}
