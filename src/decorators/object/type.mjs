import {CAUSE} from "../../libs/constants";
import {isObject} from "../../libs/types";
import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.build();

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @param {(string|number)[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	if(isObject(values.adjusted))
	{
		return false;
	}

	AdjusterError.raise(CAUSE.TYPE, values.original, keyStack);
}
