import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

const NAME = "default";
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
 * set default value
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {*} value default value
 */
function _chain(params, value)
{
	params[KEY] = {
		flag: true,
		value: value,
	};
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

	if(params[KEY].flag)
	{
		values.adjusted = params[KEY].value;
		return true;
	}

	const cause = CAUSE.REQUIRED;
	throw new AdjusterError(cause, values.original);
}
