import adjust from "../../adjust";
import AdjusterBase from "../../AdjusterBase";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		constraints: _featureConstraints,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.constraints = null;
}

/**
 * apply constraints
 * @param {Object} params parameters
 * @param {Object<string, AdjusterBase>} constraints constraints to apply
 * @returns {void}
 */
function _featureConstraints(params, constraints)
{
	params.constraints = constraints;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(params.constraints === null)
	{
		return false;
	}

	values.adjusted = adjust(values.adjusted, params.constraints);
	return false;
}
