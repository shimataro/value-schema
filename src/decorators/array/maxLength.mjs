import {CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		maxLength: _featureMaxLength,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-Array-MaxLength
 * @property {boolean} flag
 * @property {number} length
 * @property {boolean} adjust
 */

/**
 * init
 * @param {Params-Array-MaxLength} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set max-length of array
 * @param {Params-Array-MaxLength} params parameters
 * @param {number} length min-length; error if shorter
 * @param {boolean} adjust adjust value or not
 * @returns {void}
 */
function _featureMaxLength(params, length, adjust = false)
{
	params.flag = true;
	params.length = length;
	params.adjust = adjust;
}

/**
 * adjuster
 * @param {Params-Array-MaxLength} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjusted.length <= params.length)
	{
		return false;
	}

	if(params.adjust)
	{
		values.adjusted.splice(params.length);
		return false;
	}

	AdjusterError.raise(CAUSE.MAX_LENGTH, values, keyStack);
}
