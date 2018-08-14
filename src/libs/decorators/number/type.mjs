import {CAUSE} from "../../constants";
import {isNumber, isInteger, isString} from "../../types";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const REGEXP_NUMBER = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;
const REGEXP_INTEGER = /^\s*[+-]?\d+\s*$/;

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		strict: _strict,
		acceptSpecialFormats: _acceptSpecialFormats,
		integer: _integer,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagStrict = false;
	params.flagAcceptSpecialFormats = false;
	params.flagInteger = false;
	params.flagIntegerAdjust = false;
}

/**
 * enable strict type check
 * @param {Object} params parameters parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

/**
 * accept special formats; i.e., "1e+10", "0x100", "0b100"
 * @param {Object} params parameters
 * @returns {void}
 */
function _acceptSpecialFormats(params)
{
	params.flagAcceptSpecialFormats = true;
}

/**
 * limit to integer
 * @param {Object} params parameters
 * @param {boolean} [adjust=false] adjust value or not
 * @returns {void}
 */
function _integer(params, adjust = false)
{
	params.flagInteger = true;
	params.flagIntegerAdjust = adjust;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} stack error keys stack
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, stack)
{
	if(isString(values.adjusted))
	{
		if(!_checkNumberFormat(params, values.adjusted))
		{
			AdjusterError.raise(CAUSE.TYPE, values, stack);
		}
	}

	const adjusted = _toNumber(params, values.adjusted);
	if(adjusted === false)
	{
		AdjusterError.raise(CAUSE.TYPE, values, stack);
	}

	values.adjusted = adjusted;
	return false;
}

/**
 * check the format of value
 * @param {Object} params parameters
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
 * @param {Object} params parameters
 * @returns {RegExp|null} regular expression pattern
 */
function _getRegExpForNumber(params)
{
	if(params.flagAcceptSpecialFormats)
	{
		return null;
	}
	if(params.flagInteger && !params.flagIntegerAdjust)
	{
		// integer
		return REGEXP_INTEGER;
	}

	// number
	return REGEXP_NUMBER;
}

/**
 * convert to number
 * @param {Object} params parameters
 * @param {*} value value to convert
 * @returns {number|boolean} adjusted value or false(if failed)
 */
function _toNumber(params, value)
{
	// strict check
	if(!isNumber(value) && params.flagStrict)
	{
		return false;
	}

	const adjustedValue = Number(value);
	if(isNaN(adjustedValue))
	{
		// failed to cast
		return false;
	}

	if(!params.flagInteger)
	{
		return adjustedValue;
	}

	// already integer
	if(isInteger(adjustedValue))
	{
		return adjustedValue;
	}

	// parse as integer
	if(params.flagIntegerAdjust)
	{
		return parseInt(adjustedValue, 10);
	}

	// not an integer
	return false;
}
