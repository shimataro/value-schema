import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		acceptEmptyString: _featureAcceptEmptyString,
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
 * accept empty string
 * @param {Object} params parameters
 * @param {*} [value=null] value on empty
 * @returns {void}
 */
function _featureAcceptEmptyString(params, value = null)
{
	params.flag = true;
	params.valueOnEmpty = value;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(values.adjusted !== "")
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnEmpty;
		return true;
	}

	AdjusterError.raise(CAUSE.EMPTY, values);
}
