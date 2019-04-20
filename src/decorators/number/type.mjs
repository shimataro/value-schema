import {CAUSE} from "../../libs/constants";
import {isScalar, isNumber, isInteger, isString} from "../../libs/types";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

const REGEXP_NUMBER = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;
const REGEXP_INTEGER = /^\s*[+-]?\d+\s*$/;

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		strict: _strict,
		acceptSpecialFormats: _acceptSpecialFormats,
		integer: _integer,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Number-Type
 * @property {boolean} flagStrict
 * @property {boolean} flagAcceptSpecialFormats
 * @property {boolean} flagInteger
 * @property {boolean} flagIntegerFits
 */

/**
 * init
 * @param {Params-Number-Type} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagStrict = false;
	params.flagAcceptSpecialFormats = false;
	params.flagInteger = false;
	params.flagIntegerFits = false;
}

/**
 * enable strict type check
 * @param {Params-Number-Type} params parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

/**
 * accept special formats; i.e., "1e+10", "0x100", "0b100"
 * @param {Params-Number-Type} params parameters
 * @returns {void}
 */
function _acceptSpecialFormats(params)
{
	params.flagAcceptSpecialFormats = true;
}

/**
 * limit to integer
 * @param {Params-Number-Type} params parameters
 * @param {boolean} [fits=false] fit value to schema or not
 * @returns {void}
 */
function _integer(params, fits = false)
{
	params.flagInteger = true;
	params.flagIntegerFits = fits;
}

/**
 * fit
 * @param {Params-Number-Type} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(isString(values.fitted))
	{
		if(!_checkNumberFormat(params, values.fitted))
		{
			ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
		}
	}

	const fitted = _toNumber(params, values.fitted);
	if(fitted === false)
	{
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	values.fitted = fitted;
	return false;
}

/**
 * check the format of value
 * @param {Params-Number-Type} params parameters
 * @param {string} value value to check
 * @returns {boolean} OK/NG
 */
function _checkNumberFormat(params, value)
{
	const re = _getRegExpForNumber(params);
	if(re === null)
	{
		return true;
	}
	return re.test(value);
}

/**
 * get RegExp pattern for number
 * @param {Params-Number-Type} params parameters
 * @returns {RegExp|null} regular expression pattern
 */
function _getRegExpForNumber(params)
{
	if(params.flagAcceptSpecialFormats)
	{
		return null;
	}
	if(params.flagInteger && !params.flagIntegerFits)
	{
		// integer
		return REGEXP_INTEGER;
	}

	// number
	return REGEXP_NUMBER;
}

/**
 * convert to number
 * @param {Params-Number-Type} params parameters
 * @param {*} value value to convert
 * @returns {number|boolean} fitted value or false(if failed)
 */
function _toNumber(params, value)
{
	// strict check
	if(!isNumber(value) && params.flagStrict)
	{
		return false;
	}

	if(!isScalar(value))
	{
		// not a scalar value
		return false;
	}

	const fittedValue = Number(value);
	if(!isNumber(fittedValue))
	{
		// failed to cast
		return false;
	}

	if(!params.flagInteger)
	{
		return fittedValue;
	}

	// already integer
	if(isInteger(fittedValue))
	{
		return fittedValue;
	}

	// parse as integer
	if(params.flagIntegerFits)
	{
		if(fittedValue > 0)
		{
			return Math.floor(fittedValue);
		}
		else
		{
			return Math.ceil(fittedValue);
		}
	}

	// not an integer
	return false;
}
