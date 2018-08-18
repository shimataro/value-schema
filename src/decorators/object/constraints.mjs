import adjustObject from "../../libs/adjustObject";
import AdjusterBase from "../../libs/AdjusterBase";

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
 * @param {adjuster._.types.Constraints} constraints constraints to apply
 * @returns {void}
 */
function _featureConstraints(params, constraints)
{
	params.constraints = constraints;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {adjuster._.types.decorator.Values} values original / adjusted values
 * @param {adjuster._.types.Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(params.constraints === null)
	{
		return false;
	}

	values.adjusted = adjustObject(values.adjusted, params.constraints, AdjusterBase.onErrorDefault, keyStack);
	return false;
}
