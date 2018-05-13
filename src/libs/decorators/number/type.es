import {CAUSE} from "../../constants";
import AdjusterInterface from "../../AdjusterInterface";
import AdjusterError from "../../AdjusterError";

export default AdjusterInterface.createDecorator(_adjust);

/**
 * adjust
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
 * @return {boolean} end adjustment
 */
function _adjust(params, values)
{
	if(typeof values.adjustedValue === "number")
	{
		return false;
	}

	const adjustedValue = Number(values.adjustedValue);

	if(!isNaN(adjustedValue))
	{
		values.adjustedValue = adjustedValue;
		return false;
	}

	// failed to cast
	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.originalValue);
}
