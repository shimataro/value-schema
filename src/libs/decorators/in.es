import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

const NAME = "in";
const KEY = Symbol(NAME);

export default AdjusterInterface.createDecorator(_adjust, {
	name: NAME,
	init: _init,
	function: _in,
});

/**
 * init
 * @param {Object} params parameters
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
 * @param {...*} values values to be accepted
 */
function _in(params, ...values)
{
	params[KEY] = {
		flag: true,
		values: values,
	};
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(!params[KEY].flag)
	{
		return false;
	}
	if(params[KEY].values.includes(values.adjustedValue))
	{
		return true;
	}

	const cause = CAUSE.IN;
	throw new AdjusterError(cause, values.originalValue);
}
