import {CAUSE} from "../../libs/constants";
import {isString, isArray} from "../../libs/types";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		separatedBy: _featureSeparatedBy,
		toArray: _featureToArray,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Array-Type
 * @property {boolean} flagSeparatedBy
 * @property {boolean} flagToArray
 * @property {Separator} separator
 */

/**
 * init
 * @param {Params-Array-Type} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagSeparatedBy = false;
	params.flagToArray = false;
}

/**
 * accept string and set separator
 * @param {Params-Array-Type} params parameters
 * @param {Separator} separator separator
 * @returns {void}
 */
function _featureSeparatedBy(params, separator)
{
	params.flagSeparatedBy = true;
	params.separator = separator;
}

/**
 * convert to array, if not
 * @param {Params-Array-Type} params parameters
 * @returns {void}
 */
function _featureToArray(params)
{
	params.flagToArray = true;
}

/**
 * fitting function
 * @param {Params-Array-Type} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(isArray(values.fitted))
	{
		return false;
	}

	if(isString(values.fitted) && params.flagSeparatedBy)
	{
		values.fitted = values.fitted.split(params.separator);
		return false;
	}

	if(params.flagToArray)
	{
		values.fitted = [values.fitted];
		return false;
	}

	ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
