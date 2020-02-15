import {CAUSE} from "./constants";
import {Key, isObject} from "./types";
import {ValueSchemaError} from "./ValueSchemaError";
import {BaseSchema, ErrorHandler, FinishHandler} from "./BaseSchema";

export type SchemaObject = Record<string, BaseSchema>

/**
 * apply schema to data object
 * @param data object to apply
 * @param schemaObject schema objects
 * @param onError error handler
 * @param onFinished finish handler
 * @param keyStack path to key that caused error
 * @returns applied data
 */
export function applySchemaToCore<T extends object>(data: unknown, schemaObject: SchemaObject, onError: ErrorHandler, onFinished: FinishHandler, keyStack: Key[]): T
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
	 * error handler (to avoid "no-loop-fun" error on eslint)
	 * @param err error object
	 * @returns error handler
	 */
	function errorHandler(err: ValueSchemaError): unknown | void
	{
		hasError = true;

		return onError(err);
	}
}
