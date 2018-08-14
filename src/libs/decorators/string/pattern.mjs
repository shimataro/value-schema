import {isString} from "../../types";
import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

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
 * @param {(string|number)[]} stack error keys stack
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, stack)
{
	if(!params.flag)
	{
		return false;
	}
	if(params.pattern.test(values.adjusted))
	{
		return false;
	}

	AdjusterError.raise(CAUSE.PATTERN, values, stack);
}
