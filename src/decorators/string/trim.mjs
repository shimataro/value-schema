import AdjusterBase from "../../libs/AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		trim: _featureTrim,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * remove whitespace from both ends
 * @param {Object} params parameters
 * @returns {void}
 */
function _featureTrim(params)
{
	params.flag = true;
}

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
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
