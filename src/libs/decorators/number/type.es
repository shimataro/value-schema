import {CAUSE} from "../../constants";
import AdjusterError from "../../AdjusterError";
import AdjusterInterface from "../../AdjusterInterface";

export default AdjusterInterface.createDecorator("type", _adjust);

/**
 * adjust
 * @param {Object} params parameters
 * @param {Object} values original / adjusted values
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
