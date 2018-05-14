import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

const NAME = "allowEmpty";
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
 * allow empty string; will be adjusted to 0
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {*} [value=null] value on empty
 */
function _chain(params, value = null)
{
	params[KEY] = {
		flag: true,
		valueOnEmpty: value,
	};
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

	if(params[KEY].flag)
	{
		values.adjusted = params[KEY].valueOnEmpty;
		return true;
	}

	const cause = CAUSE.EMPTY;
	throw new AdjusterError(cause, values.original);
}
