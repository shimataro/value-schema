import {CAUSE} from "../../libs/constants";
import {isString, isArray, isObject} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

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
 * @param {adjuster.Types._decorator.Values} values original / adjusted values
 * @param {adjuster.Types.Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(isString(values.adjusted))
	{
		return false;
	}

	// strict check
	if(params.flagStrict)
	{
		AdjusterError.raise(CAUSE.TYPE, values, keyStack);
	}

	// array or object cannot be convert to string
	if(isArray(values.adjusted) || isObject(values.adjusted))
	{
		AdjusterError.raise(CAUSE.TYPE, values, keyStack);
	}

	values.adjusted = String(values.adjusted);
	return false;
}
