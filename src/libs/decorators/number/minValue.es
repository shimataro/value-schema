import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const NAME = "minValue";
const KEY = Symbol(NAME);

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
	params[KEY] = {
		flag: false,
	};
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
	params[KEY] = {
		flag: true,
		value: value,
		adjust: adjust,
	};
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
	if(!params[KEY].flag)
	{
		return false;
	}
	if(values.adjusted >= params[KEY].value)
	{
		return false;
	}
	if(params[KEY].adjust)
	{
		values.adjusted = params[KEY].value;
		return false;
	}

	const cause = CAUSE.MIN_VALUE;
	throw new AdjusterError(cause, values.original);
}
