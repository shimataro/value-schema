import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const REGEXP = /^\d+$/;

export default AdjusterBase.decoratorBuilder(_adjust)
	.build();

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(REGEXP.test(values.adjusted))
	{
		return false;
	}

	const cause = CAUSE.PATTERN;
	throw new AdjusterError(cause, values.original);
}
