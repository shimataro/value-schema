import AdjusterBase from "../../libs/AdjusterBase";
import * as string from "../../libs/string";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		fullWidthToHalf: _featureFullWidthToHalf,
	})
	.build();

/**
 * @package
 * @callback Fail
 */

/**
 * @package
 * @typedef {Params} Params-NumericString-FullWidthToHalf
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-NumericString-FullWidthToHalf} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * convert full-width to half-width
 * @param {Params-NumericString-FullWidthToHalf} params parameters
 * @returns {void}
 */
function _featureFullWidthToHalf(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Params-NumericString-FullWidthToHalf} params parameters
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
