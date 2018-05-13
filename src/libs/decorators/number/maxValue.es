import {CAUSE} from "../../constants";
import AdjusterInterface from "../../AdjusterInterface";
import AdjusterError from "../../AdjusterError";

const NAME = "maxValue";
const KEY = Symbol(NAME);

export default AdjusterInterface.createDecorator(_adjust, {
	name: NAME,
	init: _init,
	function: _maxValue,
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
 * set min-value
 * @param {number} value max-value
 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _maxValue(params, value, adjust = false)
{
	params[KEY] = {
		flag: true,
		value: value,
		adjust: adjust,
	};
}

/**
 * adjust
 * @param {_TypeValues} values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(!params[KEY].flag)
	{
		return false;
	}
	if(values.adjustedValue <= params[KEY].value)
	{
		return false;
	}
	if(params[KEY].adjust)
	{
		values.adjustedValue = params[KEY].value;
		return false;
	}

	const cause = CAUSE.MAX_VALUE;
	throw new AdjusterError(cause, values.originalValue);
}
