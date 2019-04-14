import {CAUSE} from "../libs/constants";
import AdjusterBase from "../libs/AdjusterBase";
import AdjusterError from "../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		map: _featureTransform,
		transform: _featureTransform,
	})
	.build();

/**
 * @package
 * @callback Fail
 */

/**
 * @package
 * @callback Transformer
 * @param {*} value value to transform
 * @param {Fail} fail callback on fail
 * @returns {*} transformed value
 */

/**
 * @package
 * @typedef {Params} Params-Only
 * @property {boolean} flag
 * @property {Mapper | null} maper
 */

/**
 * init
 * @param {Params-Only} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
	params.mapper = null;
}

/**
 * accept only specified values
 * @param {Params-Only} params parameters
 * @param {Transformer} mapper mapper function
 * @returns {void}
 */
function _featureTransform(params, mapper)
{
	params.flag = true;
	params.mapper = mapper;
}

/**
 * adjust
 * @param {Params-Only} params parameters
 * @param {Decorator-Values} values original / adjusted values
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

	values.adjusted = params.mapper(values.adjusted, () =>
	{
		AdjusterError.raise(CAUSE.TRANSFORM, values, keyStack);
	});
	return false;
}
