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
 * @package
 * @typedef {Params} Params-String-Pattern
 * @property {boolean} flag
 * @property {RegExp} pattern
 */

/**
 * init
 * @param {Params-String-Pattern} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
	params.pattern = null;
}

/**
 * specify acceptable pattern by regular expression
 * @param {Params-String-Pattern} params parameters
 * @param {RegExp} pattern acceptable pattern(regular expression)
 * @returns {void}
 */
function _featurePattern(params, pattern)
{
	params.flag = true;
	params.pattern = pattern;
}

/**
 * adjust
 * @param {Params-String-Pattern} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
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
