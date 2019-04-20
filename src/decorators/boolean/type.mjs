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
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	let {adjusted} = values;

	if(isBoolean(adjusted))
	{
		// already boolean
		return false;
	}
	if(params.flagStrict)
	{
		// strict check mode
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	if(isString(adjusted))
	{
		// "true" is true, "false" is false
		if(REGEXP_TRUE.test(adjusted))
		{
			values.adjusted = true;
			return false;
		}
		if(REGEXP_FALSE.test(adjusted))
		{
			values.adjusted = false;
			return false;
		}

		// convert to number
		adjusted = Number(adjusted);
	}

	if(isNumber(adjusted))
	{
		if(adjusted === 0 || adjusted === 1 || params.flagAcceptAllNumbers)
		{
			values.adjusted = Boolean(adjusted);
			return false;
		}
	}

	ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
