import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		allowEmptyString: _featureAllowEmptyString,
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
 * allow empty string; will be adjusted to 0
 * @param {Object} params parameters
 * @param {*} [value=null] value on empty
 */
function _featureAllowEmptyString(params, value = null)
{
	params.flag = true;
	params.valueOnEmpty = value;
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
	if(values.adjusted !== "")
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnEmpty;
		return true;
	}

	const cause = CAUSE.EMPTY;
	throw new AdjusterError(cause, values.original);
}
