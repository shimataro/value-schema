import {ErrorHandler, FinishHandler} from "./publicTypes";
import {AnyObject, Key, ObjectTypeOf, SchemaObject, isObject} from "./types";
import {CAUSE, ValueSchemaError} from "./ValueSchemaError";

/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinished finish handler
 * @param keyStack path to key that caused error
 * @returns applied data
 */
export function applySchemaObjectCore<S extends SchemaObject>(schemaObject: S, data: unknown, onError: ErrorHandler, onFinished: FinishHandler, keyStack: Key[]): ObjectTypeOf<S>
{
	if(!isObject(data))
	{
		const err = new ValueSchemaError(CAUSE.TYPE, data, keyStack);
		const result = onError(err);
		if(!isObject(result))
		{
			throw err;
		}

		return result as ObjectTypeOf<S>;
	}

	const appliedObject: AnyObject = {};
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
	return appliedObject as ObjectTypeOf<S>;

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
