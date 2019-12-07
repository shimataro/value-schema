import {CAUSE} from "../../libs/constants";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		maxValue: _featureMaxValue,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Number-MaxValue
 * @property {number} value
 * @property {boolean} fits
 */

/**
 * init
 * @param {Params-Number-MaxValue} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.value = Number.MAX_SAFE_INTEGER;
	params.fits = false;
}

/**
 * set min-value
 * @param {Params-Number-MaxValue} params parameters
 * @param {number} value max-value
 * @param {boolean} [fits=false] fit to max-value if value > max-value; default is ERROR
 * @returns {void}
 */
function _featureMaxValue(params, value, fits = false)
{
	params.value = value;
	params.fits = fits;
}

/**
 * fit
 * @param {Params-Number-MaxValue} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.fitted <= params.value)
	{
		return false;
	}
	if(params.fits)
	{
		values.fitted = params.value;
		return false;
	}

	ValueSchemaError.raise(CAUSE.MAX_VALUE, values, keyStack);
}
