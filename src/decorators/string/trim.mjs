import AdjusterBase from "../../libs/AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		trim: _featureTrim,
	})
	.build();

/**
 * @package
 * @typedef {Object} Params-String-Trim
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
 * adjust
 * @param {Params-String-Trim} params parameters
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
	values.adjusted = values.adjusted.trim();
	return false;
}
