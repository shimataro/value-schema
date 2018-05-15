import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

import {isString} from "../../utilities";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.chain({
		separatedBy: _chainSeparatedBy,
		toArray: _chainToArray,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.separatedBy = false;
	params.toArray = false;
}

/**
 * allow string and set separator
 * @param {Object} params parameters
 * @param {string|String|RegExp} separator separator
 */
function _chainSeparatedBy(params, separator)
{
	params.separatedBy = true;
	params.separator = separator;
}

/**
 * convert to array, if not
 * @param {Object} params parameters
 */
function _chainToArray(params)
{
	params.toArray = true;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(Array.isArray(values.adjusted))
	{
		return false;
	}

	if(isString(values.adjusted) && params.separatedBy)
	{
		values.adjusted = values.adjusted.split(params.separator);
		return false;
	}

	if(params.toArray)
	{
		values.adjusted = [values.adjusted];
		return false;
	}

	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.original);
}
