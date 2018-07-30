export default adjust;

import {CAUSE} from "./constants";
import AdjusterBase from "./AdjusterBase";
import AdjusterError from "./AdjusterError";

/**
 * adjust multiple variables (as object)
 * @param {Object<string, *>} data data to be adjusted
 * @param {Object<string, AdjusterBase>} constraints adjuster objects
 * @param {AdjusterBase.OnError} [onError] error handler
 * @return {Object<string, *>} adjusted data
 */
function adjust(data, constraints, onError = AdjusterBase.onErrorDefault)
{
	if(typeof data !== "object")
	{
		const cause = CAUSE.NOT_OBJECT;
		const err = new AdjusterError(cause, data);
		return onError(err);
	}

	const result = {};
	let hasError = false;
	for(const key of Object.keys(constraints))
	{
		const adjustedValue = constraints[key].adjust(data[key], generateErrorHandler(key));
		if(adjustedValue !== undefined)
		{
			result[key] = adjustedValue;
		}
	}

	if(hasError)
	{
		onError(null);
	}
	return result;

	/**
	 * error handler generator (to avoid "no-loop-fun" error on eslint)
	 * @param {string} key key
	 * @return {AdjusterBase.onError} error handler
	 */
	function generateErrorHandler(key)
	{
		return (err) =>
		{
			hasError = true;

			err.key = key;
			return onError(err);
		};
	}
}
