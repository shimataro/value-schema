import BaseSchema from "../../libs/BaseSchema";
import * as string from "../../libs/string";

export default BaseSchema.decoratorBuilder(_fit)
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
 * fit
 * @param {Params-Number-AcceptFullWidth} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @returns {boolean} ends fitting
 */
function _fit(params, values)
{
	if(!params.flag)
	{
		return false;
	}

	values.fitted = string.toHalfWidth(values.fitted, /[０-９ａ-ｚＡ-Ｚ．＋－]+/g);
	return false;
}
