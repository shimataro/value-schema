import {CAUSE} from "../../libs/constants";
import {isBoolean, isNumber, isString} from "../../libs/types";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		strict: _strict,
		acceptAllNumbers: _acceptAllNumbers,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Boolean-Type
 * @property {boolean} flagStrict
 * @property {boolean} flagAcceptAllNumbers
 */

/**
 * init
 * @param {Params-Boolean-Type} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagStrict = false;
	params.flagAcceptAllNumbers = false;
}

/**
 * enable strict type check
 * @param {Params-Boolean-Type} params parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

/**
 * accept all numbers, other than 0 / 1
 * @param {Params-Boolean-Type} params parameters
 * @returns {void}
 */
function _acceptAllNumbers(params)
{
	params.flagAcceptAllNumbers = true;
}

/**
 * fit
 * @param {Params-Boolean-Type} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	let {fitted} = values;

	if(isBoolean(fitted))
	{
		// already boolean
		return false;
	}
	if(params.flagStrict)
	{
		// strict check mode
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	if(isString(fitted))
	{
		// "true" is true, "false" is false
		if(REGEXP_TRUE.test(fitted))
		{
			values.fitted = true;
			return false;
		}
		if(REGEXP_FALSE.test(fitted))
		{
			values.fitted = false;
			return false;
		}

		// convert to number
		fitted = Number(fitted);
	}

	if(isNumber(fitted))
	{
		if(fitted === 0 || fitted === 1 || params.flagAcceptAllNumbers)
		{
			values.fitted = Boolean(fitted);
			return false;
		}
	}

	ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
