import {CAUSE} from "../libs/constants";
import BaseSchema from "../libs/BaseSchema";
import ValueSchemaError from "../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		acceptEmptyString: _featureAcceptEmptyString,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-AcceptEmptyString
 * @property {boolean} flag
 * @property {*|null} valueOnEmpty
 */

/**
 * init
 * @param {Params-AcceptEmptyString} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept empty string
 * @param {Params-AcceptEmptyString} params parameters
 * @param {*} [value=null] value on empty
 * @returns {void}
 */
function _featureAcceptEmptyString(params, value = null)
{
	params.flag = true;
	params.valueOnEmpty = value;
}

/**
 * fit
 * @param {Params-AcceptEmptyString} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.adjusted !== "")
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.valueOnEmpty;
		return true;
	}

	ValueSchemaError.raise(CAUSE.EMPTY, values, keyStack);
}
