import AdjusterBase from "../../libs/AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		separatedBy: _featureSeparatedBy,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-NumericString-SeparatedBy
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
 * adjust
 * @param {Params-NumericString-SeparatedBy} params parameters
 * @param {DecoratorValues} values original / adjusted values
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(!params.flag)
	{
		return false;
	}

	values.adjusted = values.adjusted.split(params.separator).join("");
	return false;
}
