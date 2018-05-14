import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

const NAME = "in";
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
		name: NAME,
		flag: false,
	};
}

/**
 * accept only specified values
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {...*} values values to be accepted
 */
function _chain(params, ...values)
{
	params[KEY] = {
		flag: true,
		values: values,
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
	if(!params[KEY].flag)
	{
		return false;
	}
	if(params[KEY].values.includes(values.adjusted))
	{
		return true;
	}

	const cause = CAUSE.IN;
	throw new AdjusterError(cause, values.original);
}
