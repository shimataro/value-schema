import {CAUSE} from "./../libs/constants";
import BaseSchema from "./../libs/BaseSchema";
import ValueSchemaError from "./../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		only: _featureOnly,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Only
 * @property {boolean} flag
 * @property {Set<*>} values
 */

/**
 * init
 * @param {Params-Only} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept only specified values
 * @param {Params-Only} params parameters
 * @param {...*} values values to be accepted
 * @returns {void}
 */
function _featureOnly(params, ...values)
{
	params.flag = true;
	params.values = new Set(values);
}

/**
 * fit
 * @param {Params-Only} params parameters
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
	if(params.values.has(values.fitted))
	{
		return true;
	}

	ValueSchemaError.raise(CAUSE.ONLY, values, keyStack);
}
