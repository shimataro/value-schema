import {CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		minLength: _featureMinLength,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-String-MinLength
 * @property {boolean} flag
 * @property {number} length
 */

/**
 * init
 * @param {Params-String-MinLength} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-length
 * @param {Params-String-MinLength} params parameters
 * @param {number} length min-length; error if shorter
 * @returns {void}
 */
function _featureMinLength(params, length)
{
	params.flag = true;
	params.length = length;
}

/**
 * adjust
 * @param {Params-String-MinLength} params parameters
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
	if(values.adjusted.length >= params.length)
	{
		return false;
	}

	AdjusterError.raise(CAUSE.MIN_LENGTH, values, keyStack);
}
