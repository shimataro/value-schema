import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

const NAME = "default";
const KEY = Symbol(NAME);

export default AdjusterInterface.createDecorator(_adjust, {
	name: NAME,
	init: _init,
	function: _default,
});

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params[KEY] = {
		flag: false,
	};
}

/**
 * set default value
 * @param {Object} params parameters
 * @param {*} value default value
 */
function _default(params, value)
{
	params[KEY] = {
		flag: true,
		value: value,
	};
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(values.adjustedValue !== undefined)
	{
		return false;
	}

	if(params[KEY].flag)
	{
		values.adjustedValue = params[KEY].value;
		return true;
	}

	const cause = CAUSE.REQUIRED;
	throw new AdjusterError(cause, values.originalValue);
}
