import {CAUSE} from "../../libs/constants";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

const REGEXP = /^\d+$/;

export default AdjusterBase.decoratorBuilder(_adjust)
	.build();

/**
 * adjust
 * @param {Object} params parameters
 * @param {adjuster._.types.decorator.Values} values original / adjusted values
 * @param {adjuster._.types.Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(REGEXP.test(values.adjusted))
	{
		return false;
	}

	AdjusterError.raise(CAUSE.PATTERN, values, keyStack);
}
