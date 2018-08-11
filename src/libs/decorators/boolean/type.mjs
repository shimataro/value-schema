import {CAUSE} from "../../constants";
import {isBoolean, isNumber, isString} from "../../types";
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
 * @param {Object} params parameters
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
	let {adjusted} = values;

	if(isBoolean(adjusted))
	{
		// already boolean
		return false;
	}
	if(params.flagStrict)
	{
		// strict check mode
		_throwError(adjusted);
	}

	if(isString(adjusted))
	{
		// "true" is true, "false" is false
		switch(adjusted.toLowerCase())
		{
		case "true":
			values.adjusted = true;
			return false;

		case "false":
			values.adjusted = false;
			return false;
		}

		// convert to number
		adjusted = Number(adjusted);
	}

	if(isNumber(adjusted))
	{
		values.adjusted = Boolean(adjusted);
		return false;
	}

	_throwError(values);
}

/**
 * throw TYPE error
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {void}
 * @throws {AdjusterError}
 */
function _throwError(values)
{
	const cause = CAUSE.TYPE;
	throw new AdjusterError(cause, values.original);
}
