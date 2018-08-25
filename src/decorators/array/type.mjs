import {CAUSE} from "../../libs/constants";
import {isString, isArray} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		separatedBy: _featureSeparatedBy,
		toArray: _featureToArray,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-Array-Type
 * @property {boolean} flagSeparatedBy
 * @property {boolean} flagToArray
 * @property {Separator} separator
 */

/**
 * init
 * @param {Params-Array-Type} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flagSeparatedBy = false;
	params.flagToArray = false;
}

/**
 * accept string and set separator
 * @param {Params-Array-Type} params parameters
 * @param {Separator} separator separator
 * @returns {void}
 */
function _featureSeparatedBy(params, separator)
{
	params.flagSeparatedBy = true;
	params.separator = separator;
}

/**
 * convert to array, if not
 * @param {Params-Array-Type} params parameters
 * @returns {void}
 */
function _featureToArray(params)
{
	params.flagToArray = true;
}

/**
 * adjuster
 * @param {Params-Array-Type} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(isArray(values.adjusted))
	{
		return false;
	}

	if(isString(values.adjusted) && params.flagSeparatedBy)
	{
		values.adjusted = values.adjusted.split(params.separator);
		return false;
	}

	if(params.flagToArray)
	{
		values.adjusted = [values.adjusted];
		return false;
	}

	AdjusterError.raise(CAUSE.TYPE, values, keyStack);
}
