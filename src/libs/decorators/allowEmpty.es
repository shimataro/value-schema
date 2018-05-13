import {CAUSE} from "../constants";
import AdjusterInterface from "../AdjusterInterface";
import AdjusterError from "../AdjusterError";

const NAME = "allowEmpty";
const KEY = Symbol(NAME);

export default AdjusterInterface.createDecorator(_adjust, {
	name: NAME,
	init: _init,
	function: _allowEmpty,
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
 * allow empty string; will be adjusted to 0
 * @param {Object} params parameters
 * @param {*} [value=null] value on empty
 */
function _allowEmpty(params, value = null)
{
	params[KEY] = {
		flag: true,
		valueOnEmpty: value,
	};
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

	if(params[KEY].flag)
	{
		values.adjustedValue = params[KEY].valueOnEmpty;
		return true;
	}

	const cause = CAUSE.EMPTY;
	throw new AdjusterError(cause, values.originalValue);
}
