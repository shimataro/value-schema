import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		maxValue: _featureMaxValue,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.value = Number.MAX_SAFE_INTEGER;
}

/**
 * set min-value
 * @param {Object} params parameters
 * @param {number} value max-value
 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
 * @return {void}
 */
function _featureMaxValue(params, value, adjust = false)
{
	params.value = value;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(values.adjusted <= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjusted = params.value;
		return false;
	}

	AdjusterError.raise(CAUSE.MAX_VALUE, values);
}
