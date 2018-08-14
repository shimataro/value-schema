import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		acceptNull: _featureAcceptNull,
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
 * accept null
 * @param {Object} params parameters
 * @param {*} [value=null] value on null
 * @returns {void}
 */
function _featureAcceptNull(params, value = null)
{
	params.flag = true;
	params.valueOnNull = value;
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
	if(values.adjusted !== null)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnNull;
		return true;
	}

	AdjusterError.raise(CAUSE.NULL, values, stack);
}
