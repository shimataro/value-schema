import {isArray} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		joinArray: _featureJoinArray,
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
 * join array into string
 * @param {Object} params parameters
 * @returns {void}
 */
function _featureJoinArray(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {adjuster.Types._decorator.Values} values original / adjusted values
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
