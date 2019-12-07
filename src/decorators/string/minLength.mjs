import {CAUSE} from "./../../libs/constants";
import BaseSchema from "./../../libs/BaseSchema";
import ValueSchemaError from "./../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		minLength: _featureMinLength,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-String-MinLength
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
 * fit
 * @param {Params-String-MinLength} params parameters
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
	if(values.fitted.length >= params.length)
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.MIN_LENGTH, values, keyStack);
}
