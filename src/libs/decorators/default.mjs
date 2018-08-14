import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		default: _featureDefault,
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
 * set default value
 * @param {Object} params parameters
 * @param {*} value default value
 * @returns {void}
 */
function _featureDefault(params, value)
{
	params.flag = true;
	params.value = value;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} stack error keys stack
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, stack)
{
	if(values.adjusted !== undefined)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.value;
		return true;
	}

	AdjusterError.raise(CAUSE.REQUIRED, values, stack);
}
