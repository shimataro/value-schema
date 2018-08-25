import {CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		minValue: _featureMinValue,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-Number-MinValue
 * @property {number} value
 * @property {boolean} adjust
 */

/**
 * init
 * @param {Params-Number-MinValue} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.value = Number.MIN_SAFE_INTEGER;
	params.adjust = false;
}

/**
 * set min-value
 * @param {Params-Number-MinValue} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @returns {void}
 */
function _featureMinValue(params, value, adjust = false)
{
	params.value = value;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {Params-Number-MinValue} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
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

	AdjusterError.raise(CAUSE.MIN_VALUE, values, keyStack);
}
