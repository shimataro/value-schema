import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const REGEXP = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		acceptSpecialFormats: _acceptSpecialFormats,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.flag = false;
}

/**
 * accept special formats; i.e., "1e+10", "0x100", "0b100"
 * @param {Object} params parameters
 * @return {void}
 */
function _acceptSpecialFormats(params)
{
	params.flag = true;
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
	if(typeof values.adjusted !== "string")
	{
		return false;
	}

	if(params.flag)
	{
		return false;
	}
	if(REGEXP.test(values.adjusted))
	{
		return false;
	}

	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.original);
}
