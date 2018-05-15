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
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-value
 * @param {Object} params parameters
 * @param {number} value max-value
 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _featureMaxValue(params, value, adjust = false)
{
	params.flag = true;
	params.value = value;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjusted <= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjusted = params.value;
		return false;
	}

	const cause = CAUSE.MAX_VALUE;
	throw new AdjusterError(cause, values.original);
}
