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
 * @typedef {Params} Params-String-MaxLength
 * @property {boolean} flag
 * @property {number} length
 * @property {boolean} adjust
 */

/**
 * init
 * @param {Params-String-MaxLength} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set max-length
 * @param {Params-String-MaxLength} params parameters
 * @param {number} length max-length; error if longer
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 * @returns {void}
 */
function _featureMaxLength(params, length, adjust = false)
{
	params.flag = true;
	params.length = length;
	params.adjust = adjust;
}

/**
 * adjust
 * @param {Params-String-MaxLength} params parameters
 * @param {Decorator-Values} values original / adjusted values
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
		values.adjusted = values.adjusted.substr(0, params.length);
		return false;
	}

	AdjusterError.raise(CAUSE.MAX_LENGTH, values, keyStack);
}
