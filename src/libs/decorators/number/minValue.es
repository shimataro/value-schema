import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		minValue: _featureMinValue,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.value = Number.MIN_SAFE_INTEGER;
}

/**
 * set min-value
 * @param {Object} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @return {NumberAdjuster}
 */
function _featureMinValue(params, value, adjust = false)
{
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
	if(values.adjusted >= params.value)
	{
		return false;
	}
	if(params.adjust)
	{
		values.adjusted = params.value;
		return false;
	}

	const cause = CAUSE.MIN_VALUE;
	throw new AdjusterError(cause, values.original);
}
