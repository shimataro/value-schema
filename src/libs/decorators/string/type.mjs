import {isString} from "../../types";
import AdjusterBase from "../../AdjusterBase";

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
	if(isString(values.adjusted))
	{
		return false;
	}

	values.adjusted = String(values.adjusted);
	return false;
}
