import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

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
	if(typeof values.adjusted === "number")
	{
		return false;
	}

	const adjusted = Number(values.adjusted);

	if(!isNaN(adjusted))
	{
		values.adjusted = adjusted;
		return false;
	}

	// failed to cast
	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.original);
}
