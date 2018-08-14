export default adjustObject;

import {CAUSE} from "./constants";
import {isObject} from "./types";
import AdjusterError from "./AdjusterError";

/**
 * adjust an object
 * @param {Object<string, *>} data data to be adjusted
 * @param {Object<string, AdjusterBase>} constraints adjuster objects
 * @param {AdjusterBase.OnError} onError error handler
 * @param {(string|number)[]} stack error keys stack
 * @returns {Object<string, *>} adjusted data
 */
function adjustObject(data, constraints, onError, stack)
{
	if(!isObject(data))
	{
		const cause = CAUSE.TYPE;
		const err = new AdjusterError(cause, data, stack);
		return onError(err);
	}

	const result = {};
	let hasError = false;
	for(const key of Object.keys(constraints))
	{
		const adjustedValue = constraints[key]._adjust(data[key], errorHandler, [...stack, key]);
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
	 * handler generator (to avoid "no-loop-fun" error on eslint)
	 * @param {AdjusterError} err error object
	 * @returns {*} error handler
	 */
	function errorHandler(err)
	{
		hasError = true;

		return onError(err);
	}
}
