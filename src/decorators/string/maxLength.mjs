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
 * @typedef {Params} Params-String-MaxLength
 * @property {boolean} flag
 * @property {number} length
 * @property {boolean} fit
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
 * @param {boolean} [fit=false] truncate if longer; default is ERROR
 * @returns {void}
 */
function _featureMaxLength(params, length, fit = false)
{
	params.flag = true;
	params.length = length;
	params.fit = fit;
}

/**
 * fit
 * @param {Params-String-MaxLength} params parameters
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

	if(params.fit)
	{
		values.fitted = values.fitted.substr(0, params.length);
		return false;
	}

	ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
}
