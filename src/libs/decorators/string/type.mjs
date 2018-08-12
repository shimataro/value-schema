import {CAUSE} from "../../constants";
import {isString} from "../../types";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		strict: _strict,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagStrict = false;
}

/**
 * enable strict type check
 * @param {Object} params parameters parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
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
	if(isString(values.adjusted))
	{
		return false;
	}

	// strict check
	if(params.flagStrict)
	{
		AdjusterError.raise(CAUSE.TYPE, values);
	}

	values.adjusted = String(values.adjusted);
	return false;
}
