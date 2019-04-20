import {CAUSE} from "../../libs/constants";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		minLength: _featureMinLength,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Array-MinLength
 * @property {boolean} flag
 * @property {number} length
 */

/**
 * init
 * @param {Params-Array-MinLength} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-length of array
 * @param {Params-Array-MinLength} params parameters
 * @param {number} length max-length
 * @returns {void}
 */
function _featureMinLength(params, length)
{
	params.flag = true;
	params.length = length;
}

/**
 * valueSchema
 * @param {Params-Array-MinLength} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(!params.flag)
	{
		return false;
	}
	if(values.adjusted.length >= params.length)
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.MIN_LENGTH, values, keyStack);
}
