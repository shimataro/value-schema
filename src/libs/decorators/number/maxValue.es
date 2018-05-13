import {CAUSE} from "../../constants";
import AdjusterInterface from "../../AdjusterInterface";
import AdjusterError from "../../AdjusterError";

export default AdjusterInterface.createDecorator("maxValue", _adjust, {
	init: _init,
	function: _maxValue,
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
 * @param {number} value max-value
 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _maxValue(params, value, adjust = false)
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
	if(values.adjustedValue <= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjustedValue = params.value;
		return false;
	}

	const cause = CAUSE.MAX_VALUE;
	throw new AdjusterError(cause, values.originalValue);
}
