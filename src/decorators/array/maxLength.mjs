import {CAUSE} from "../../libs/constants";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		maxLength: _featureMaxLength,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Array-MaxLength
 * @property {boolean} flag
 * @property {number} length
 * @property {boolean} fits
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
 * @param {boolean} fits fit value or not
 * @returns {void}
 */
function _featureMaxLength(params, length, fits = false)
{
	params.flag = true;
	params.length = length;
	params.fits = fits;
}

/**
 * fitting function
 * @param {Params-Array-MaxLength} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.fitted.length <= params.length)
	{
		return false;
	}

	if(params.fits)
	{
		values.fitted.splice(params.length);
		return false;
	}

	ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
}
