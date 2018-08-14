import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		only: _featureOnly,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept only specified values
 * @param {Object} params parameters
 * @param {...*} values values to be accepted
 * @returns {void}
 */
function _featureOnly(params, ...values)
{
	params.flag = true;
	params.values = new Set(values);
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} stack error keys stack
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, stack)
{
	if(!params.flag)
	{
		return false;
	}
	if(params.values.has(values.adjusted))
	{
		return true;
	}

	AdjusterError.raise(CAUSE.ONLY, values, stack);
}
