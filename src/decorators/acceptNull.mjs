import {CAUSE} from "../libs/constants";
import BaseSchema from "../libs/BaseSchema";
import ValueSchemaError from "../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		acceptNull: _featureAcceptNull,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-AcceptNull
 * @property {boolean} flag
 * @property {*|null} valueOnNull
 */

/**
 * init
 * @param {Params-AcceptNull} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept null
 * @param {Params-AcceptNull} params parameters
 * @param {*} [value=null] value on null
 * @returns {void}
 */
function _featureAcceptNull(params, value = null)
{
	params.flag = true;
	params.valueOnNull = value;
}

/**
 * fit
 * @param {Params-AcceptNull} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.adjusted !== null)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnNull;
		return true;
	}

	ValueSchemaError.raise(CAUSE.NULL, values, keyStack);
}
