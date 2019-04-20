import {CAUSE} from "../libs/constants";
import BaseSchema from "../libs/BaseSchema";
import ValueSchemaError from "../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		default: _featureDefault,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Default
 * @property {boolean} flag
 * @property {*} value
 */

/**
 * init
 * @param {Params-Default} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set default value
 * @param {Params-Default} params parameters
 * @param {*} value default value
 * @returns {void}
 */
function _featureDefault(params, value)
{
	params.flag = true;
	params.value = value;
}

/**
 * fitting function
 * @param {Params-Default} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.fitted !== undefined)
	{
		return false;
	}

	if(params.flag)
	{
		values.fitted = params.value;
		return true;
	}

	ValueSchemaError.raise(CAUSE.REQUIRED, values, keyStack);
}
