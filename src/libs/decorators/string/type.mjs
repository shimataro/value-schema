import {CAUSE} from "../../constants";
import {isString} from "../../types";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		strict: _strict,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.flagStrict = false;
}

/**
 * enable strict type check
 * @param {Object} params parameters parameters
 * @return {void}
 */
function _strict(params)
{
	params.flagStrict = true;
}

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

	// strict check
	if(params.flagStrict)
	{
		const cause = CAUSE.TYPE;
		throw new AdjusterError(cause, values.original);
	}

	values.adjusted = String(values.adjusted);
	return false;
}
