import {Key, isObject} from "./types";
import {BaseSchema, ErrorHandler, FinishHandler} from "./BaseSchema";
import {CAUSE, ValueSchemaError} from "./ValueSchemaError";

export type SchemaObject = Record<string, BaseSchema>

/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinished finish handler
 * @param keyStack path to key that caused error
 * @returns applied data
 */
export function applySchemaObjectCore<T extends object>(schemaObject: SchemaObject, data: unknown, onError: ErrorHandler, onFinished: FinishHandler, keyStack: Key[]): T
{
	if(!isObject(data))
	{
		const err = new ValueSchemaError(CAUSE.TYPE, data, keyStack);
		const result = onError(err);
		if(!isObject(result))
		{
			throw err;
		}

		return result as T;
	}

	const appliedObject: Record<string, unknown> = {};
	let hasError = false;
	for(const key of Object.keys(schemaObject))
	{
		// A trick in order to call _applyTo() private method from the outside (like "friend")
		appliedObject[key] = schemaObject[key]["_applyTo"](data[key], errorHandler, [...keyStack, key]);
	}

	if(hasError)
	{
		onFinished();
	}
	return appliedObject as T;

	/**
	 * error handler (to avoid "no-loop-func" error on eslint)
	 * @param err error object
	 * @returns error handler
	 */
	function errorHandler(err: ValueSchemaError): unknown | void
	{
		hasError = true;

		return onError(err);
	}
}
