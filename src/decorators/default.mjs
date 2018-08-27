import {CAUSE} from "../libs/constants";
import AdjusterBase from "../libs/AdjusterBase";
import AdjusterError from "../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		default: _featureDefault,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Default
 * @property {boolean} flag
 * @property {*} value
 */

/**
 * init
 * @param {Params-Default} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * set default value
 * @param {Params-Default} params parameters
 * @param {*} value default value
 * @returns {void}
 */
function _featureDefault(params, value)
{
	params.flag = true;
	params.value = value;
}

/**
 * adjuster
 * @param {Params-Default} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(values.adjusted !== undefined)
	{
		return false;
	}

	if(params.flag)
	{
		values.adjusted = params.value;
		return true;
	}

	AdjusterError.raise(CAUSE.REQUIRED, values, keyStack);
}
