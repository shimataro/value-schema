import {CAUSE} from "../constants";
import AdjusterBase from "../AdjusterBase";
import AdjusterError from "../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		allowNull: _featureAllowNull,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * allow null
 * @param {Object} params parameters
 * @param {*} [value=null] value on null
 * @return {void}
 */
function _featureAllowNull(params, value = null)
{
	params.flag = true;
	params.valueOnNull = value;
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
	if(values.adjusted !== null)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnNull;
		return true;
	}

	const cause = CAUSE.NULL;
	throw new AdjusterError(cause, values.original);
}

