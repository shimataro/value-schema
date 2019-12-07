import {isArray} from "./../../libs/types";
import BaseSchema from "./../../libs/BaseSchema";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		joinArray: _featureJoinArray,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-NumericString-JoinArray
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-NumericString-JoinArray} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * join array into string
 * @param {Params-NumericString-JoinArray} params parameters
 * @returns {void}
 */
function _featureJoinArray(params)
{
	params.flag = true;
}

/**
 * fit
 * @param {Params-NumericString-JoinArray} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values)
{
	if(isArray(values.fitted) && params.flag)
	{
		values.fitted = values.fitted.join("");
	}

	return false;
}
