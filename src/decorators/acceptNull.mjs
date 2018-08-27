import {CAUSE} from "../libs/constants";
import AdjusterBase from "../libs/AdjusterBase";
import AdjusterError from "../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		acceptNull: _featureAcceptNull,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-AcceptNull
 * @property {boolean} flag
 * @property {*|null} valueOnNull
 */

/**
 * init
 * @param {Params-AcceptNull} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept null
 * @param {Params-AcceptNull} params parameters
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
 * @param {Params-AcceptNull} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
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

	AdjusterError.raise(CAUSE.NULL, values, keyStack);
}
