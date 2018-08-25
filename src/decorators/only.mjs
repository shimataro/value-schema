import {CAUSE} from "../libs/constants";
import AdjusterBase from "../libs/AdjusterBase";
import AdjusterError from "../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		only: _featureOnly,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-Only
 * @property {boolean} flag
 * @property {Set<*>} values
 */

/**
 * init
 * @param {Params-Only} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept only specified values
 * @param {Params-Only} params parameters
 * @param {...*} values values to be accepted
 * @returns {void}
 */
function _featureOnly(params, ...values)
{
	params.flag = true;
	params.values = new Set(values);
}

/**
 * adjust
 * @param {Params-Only} params parameters
 * @param {DecoratorValues} values original / adjusted values
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
	if(params.values.has(values.adjusted))
	{
		return true;
	}

	AdjusterError.raise(CAUSE.ONLY, values, keyStack);
}
