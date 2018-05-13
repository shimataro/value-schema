import {CAUSE} from "../../constants";
import AdjusterInterface from "../../AdjusterInterface";
import AdjusterError from "../../AdjusterError";

export default AdjusterInterface.createDecorator("minValue", _adjust, {
	init: _init,
	function: _minValue,
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
 * set min-value
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _minValue(params, value, adjust = false)
{
	params.flag = true;
	params.value = value;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {_TypeValues} values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjustedValue >= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjustedValue = params.value;
		return false;
	}

	const cause = CAUSE.MIN_VALUE;
	throw new AdjusterError(cause, values.originalValue);
}
