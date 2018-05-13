import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

export default AdjusterInterface.createDecorator("allowEmpty", _adjust, {
	init: _init,
	function: _allowEmpty,
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
 * allow empty string; will be adjusted to 0
 * @param {Object} params parameters
 * @param {*} [value=null] value on empty
 */
function _allowEmpty(params, value = null)
{
	params.flag = true;
	params.valueOnEmpty = value;
}

/**
 * adjust
 * @param {*} params params
 * @param {Object} values values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(values.adjustedValue !== "")
	{
		return false;
	}

	if(params.flag)
	{
		values.adjustedValue = params.valueOnEmpty;
		return true;
	}

	const cause = CAUSE.EMPTY;
	throw new AdjusterError(cause, values.originalValue);
}
