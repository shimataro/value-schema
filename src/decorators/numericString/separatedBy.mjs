import BaseSchema from "../../libs/BaseSchema";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		separatedBy: _featureSeparatedBy,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-NumericString-SeparatedBy
 * @property {boolean} flag
 * @property {Separator} separator
 */

/**
 * init
 * @param {Params-NumericString-SeparatedBy} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * ignore separator
 * @param {Params-NumericString-SeparatedBy} params parameters
 * @param {Separator} separator separator
 * @returns {void}
 */
function _featureSeparatedBy(params, separator)
{
	params.flag = true;
	params.separator = separator;
}

/**
 * fit
 * @param {Params-NumericString-SeparatedBy} params parameters
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

	values.adjusted = values.adjusted.split(params.separator).join("");
	return false;
}
