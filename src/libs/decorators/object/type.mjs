import {CAUSE} from "../../constants";
import {isObject} from "../../types";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.build();

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(isObject(values.adjusted))
	{
		return false;
	}

	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.original);
}
