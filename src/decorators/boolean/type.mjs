import {CAUSE} from "../../libs/constants";
import {isBoolean, isNumber, isString} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		strict: _strict,
		acceptAllNumbers: _acceptAllNumbers,
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
	params.flagAcceptAllNumbers = false;
}

/**
 * enable strict type check
 * @param {Object} params parameters
 * @returns {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

/**
 * accept all numbers, other than 0 / 1
 * @param {Object} params parameters
 * @returns {void}
 */
function _acceptAllNumbers(params)
{
	params.flagAcceptAllNumbers = true;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {adjuster.Types._decorator.Values} values original / adjusted values
 * @param {adjuster.Types.Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
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
		AdjusterError.raise(CAUSE.TYPE, values, keyStack);
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

	AdjusterError.raise(CAUSE.TYPE, values, keyStack);
}
