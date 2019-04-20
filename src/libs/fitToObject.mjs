export default fitToObject;

import {CAUSE} from "./constants";
import {isObject} from "./types";
import ValueSchemaError from "./ValueSchemaError";

/**
 * fit data to schema object
 * @param {Input} data object to be fitted
 * @param {SchemaObject} schemaObject schema objects
 * @param {ErrorHandler<Object>} onError error handler
 * @param {Key[]} keyStack path to key that caused error
 * @returns {Object<string, *>} fitted data
 */
function fitToObject(data, schemaObject, onError, keyStack)
{
	if(!isObject(data))
	{
		const cause = CAUSE.TYPE;
		const err = new ValueSchemaError(cause, data, keyStack);
		return onError(err);
	}

	const result = {};
	let hasError = false;
	for(const key of Object.keys(schemaObject))
	{
		const fittedValue = schemaObject[key]._fit(data[key], errorHandler, [...keyStack, key]);
		if(fittedValue !== undefined)
		{
			result[key] = fittedValue;
		}
	}

	if(hasError)
	{
		onError(null);
	}
	return result;

	/**
	 * handler generator (to avoid "no-loop-fun" error on eslint)
	 * @param {ValueSchemaError} err error object
	 * @returns {*} error handler
	 */
	function errorHandler(err)
	{
		hasError = true;

		return onError(err);
	}
}
