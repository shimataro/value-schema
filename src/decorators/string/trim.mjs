import BaseSchema from "../../libs/BaseSchema";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		trim: _featureTrim,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-String-Trim
 * @property {boolean} flag
 */

/**
 * init
 * @param {Params-String-Trim} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * remove whitespace from both ends
 * @param {Params-String-Trim} params parameters
 * @returns {void}
 */
function _featureTrim(params)
{
	params.flag = true;
}

/**
 * fit
 * @param {Params-String-Trim} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values)
{
	if(!params.flag)
	{
		return false;
	}
	values.adjusted = values.adjusted.trim();
	return false;
}
