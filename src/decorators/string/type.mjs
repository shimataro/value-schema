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
 * @package
 * @typedef {Object} Params-String-Type
 * @property {boolean} flagStrict
 */

/**
 * init
 * @param {Params-String-Type} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagStrict = false;
}

/**
 * enable strict type check
 * @param {Params-String-Type} params parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

/**
 * adjust
 * @param {Params-String-Type} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
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
