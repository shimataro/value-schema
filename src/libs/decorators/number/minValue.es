import {CAUSE} from "../../constants";
import AdjusterInterface from "../../AdjusterInterface";
import AdjusterError from "../../AdjusterError";

const NAME = "minValue";
const KEY = Symbol(NAME);

export default AdjusterInterface.createDecorator(_adjust, {
	name: NAME,
	init: _init,
	function: _minValue,
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
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _minValue(params, value, adjust = false)
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
	if(values.adjustedValue >= params[KEY].value)
	{
		return false;
	}
	if(params[KEY].adjust)
	{
		values.adjustedValue = params[KEY].value;
		return false;
	}

	const cause = CAUSE.MIN_VALUE;
	throw new AdjusterError(cause, values.originalValue);
}
