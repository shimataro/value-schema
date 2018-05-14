import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const NAME = "maxValue";
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
 * @param {number} value max-value
 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
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
	if(values.adjusted <= params[KEY].value)
	{
		return false;
	}
	if(params[KEY].adjust)
	{
		values.adjusted = params[KEY].value;
		return false;
	}

	const cause = CAUSE.MAX_VALUE;
	throw new AdjusterError(cause, values.original);
}
