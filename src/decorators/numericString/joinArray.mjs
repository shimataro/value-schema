import {isArray} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		joinArray: _featureJoinArray,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-NumericString-JoinArray
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-NumericString-JoinArray} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * join array into string
 * @param {Params-NumericString-JoinArray} params parameters
 * @returns {void}
 */
function _featureJoinArray(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Params-NumericString-JoinArray} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(isArray(values.adjusted) && params.flag)
	{
		values.adjusted = values.adjusted.join("");
	}

	return false;
}
