import Case from "case";

import {STRING, CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		case: _featureCase,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-String-Case
 * @property {boolean} flag
 * @property {string} method
 */

/**
 * init
 * @param {Params-String-Case} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
	params.method = null;
}

/**
 * convert case
 * @param {Params-String-Case} params parameters
 * @param {string} method case method
 * @returns {void}
 */
function _featureCase(params, method)
{
	params.flag = true;
	params.method = method;
}

/**
 * adjust
 * @param {Params-String-Case} params parameters
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

	switch(params.method)
	{
	case STRING.CASE.LOWER:
		values.adjusted = Case.lower(values.adjusted, "");
		break;

	case STRING.CASE.UPPER:
		values.adjusted = Case.upper(values.adjusted, "");
		break;

	case STRING.CASE.LOWER_CAMEL:
		values.adjusted = Case.camel(values.adjusted);
		break;

	case STRING.CASE.UPPER_CAMEL:
		values.adjusted = Case.pascal(values.adjusted);
		break;

	case STRING.CASE.LOWER_SNAKE:
		values.adjusted = Case.snake(values.adjusted);
		break;

	case STRING.CASE.UPPER_SNAKE:
		values.adjusted = Case.constant(values.adjusted);
		break;

	case STRING.CASE.LOWER_KEBAB:
		values.adjusted = Case.kebab(values.adjusted);
		break;

	case STRING.CASE.UPPER_KEBAB:
		values.adjusted = Case.header(values.adjusted);
		break;

	default:
		AdjusterError.raise(CAUSE.CASE, values, keyStack);
	}
	return false;
}
