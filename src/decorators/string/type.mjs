import {CAUSE} from "../../libs/constants";
import {isScalar, isString} from "../../libs/types";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		strict: _strict,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-String-Type
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
 * fit
 * @param {Params-String-Type} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(isString(values.fitted))
	{
		return false;
	}

	// strict check
	if(params.flagStrict)
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	// non-scalar value cannot be convert to string
	if(!isScalar(values.fitted))
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	values.fitted = String(values.fitted);
	return false;
}
