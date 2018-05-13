import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

export default AdjusterInterface.createDecorator("default", _adjust, {
	init: _init,
	function: _default,
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
 * set default value
 * @param {Object} params parameters
 * @param {*} value default value
 */
function _default(params, value)
{
	params.flag = true;
	params.value = value;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
 */
function _adjust(params, values)
{
	if(values.adjustedValue !== undefined)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjustedValue = params.value;
		return true;
	}

	const cause = CAUSE.REQUIRED;
	throw new AdjusterError(cause, values.originalValue);
}
