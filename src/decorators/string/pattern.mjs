import {isString} from "../../libs/types";
import {CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		pattern: _featurePattern,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * specify acceptable pattern by regular expression
 * @param {Object} params parameters
 * @param {string|RegExp} pattern acceptable pattern(regular expression); string or RegExp
 * @returns {void}
 */
function _featurePattern(params, pattern)
{
	if(isString(pattern))
	{
		pattern = new RegExp(pattern);
	}

	params.flag = true;
	params.pattern = pattern;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(!params.flag)
	{
		return false;
	}
	if(params.pattern.test(values.adjusted))
	{
		return false;
	}

	AdjusterError.raise(CAUSE.PATTERN, values, keyStack);
}
