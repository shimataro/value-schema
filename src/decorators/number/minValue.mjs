import {CAUSE} from "../../libs/constants";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		minValue: _featureMinValue,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Number-MinValue
 * @property {number} value
 * @property {boolean} fits
 */

/**
 * init
 * @param {Params-Number-MinValue} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.value = Number.MIN_SAFE_INTEGER;
	params.fits = false;
}

/**
 * set min-value
 * @param {Params-Number-MinValue} params parameters
 * @param {number} value min-value
 * @param {boolean} [fits=false] fit input to value if input < value; false throws ValueSchemaError
 * @returns {void}
 */
function _featureMinValue(params, value, fits = false)
{
	params.value = value;
	params.fits = fits;
}

/**
 * fit
 * @param {Params-Number-MinValue} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.fitted >= params.value)
	{
		return false;
	}
	if(params.fits)
	{
		values.fitted = params.value;
		return false;
	}

	ValueSchemaError.raise(CAUSE.MIN_VALUE, values, keyStack);
}
