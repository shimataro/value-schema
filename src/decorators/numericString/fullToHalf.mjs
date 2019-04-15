import AdjusterBase from "../../libs/AdjusterBase";
import * as string from "../../libs/string";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		fullToHalf: _featureFullToHalf,
	})
	.build();

/**
 * @package
 * @callback Fail
 */

/**
 * @package
 * @typedef {Params} Params-NumericString-FullToHalf
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-NumericString-FullToHalf} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * convert full-width to half-width
 * @param {Params-NumericString-FullToHalf} params parameters
 * @returns {void}
 */
function _featureFullToHalf(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Params-NumericString-FullToHalf} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values /* , keyStack */)
{
	if(!params.flag)
	{
		return false;
	}

	values.adjusted = string.toHalfWidth(values.adjusted, /[０-９]+/g);
	return false;
}
