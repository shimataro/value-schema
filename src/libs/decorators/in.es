import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

export default AdjusterInterface.createDecorator("in", _adjust, {
	init: _init,
	function: _in,
});

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept only specified values
 * @param {...*} values values to be accepted
 */
function _in(params, ...values)
{
	params.flag = true;
	params.values = values;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	if(params.values.includes(values.adjustedValue))
	{
		return true;
	}

	const cause = CAUSE.IN;
	throw new AdjusterError(cause, values.originalValue);
}
