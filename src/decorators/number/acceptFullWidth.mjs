import AdjusterBase from "../../libs/AdjusterBase";
import * as string from "../../libs/string";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		acceptFullWidth: _featureAcceptFullWidth,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Number-AcceptFullWidth
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-Number-AcceptFullWidth} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set min-value
 * @param {Params-Number-AcceptFullWidth} params parameters
 * @returns {void}
 */
function _featureAcceptFullWidth(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Params-Number-AcceptFullWidth} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @returns {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}

	values.adjusted = string.toHalfWidth(values.adjusted, /[０-９．]+/g);
	return false;
}
