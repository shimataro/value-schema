import {SchemaObject, applyToObject} from "./applyToObject";
import {ErrorHandler, FinishHandler, onErrorDefault, onFinishedDefault} from "./BaseSchema";

export {SchemaObject} from "./applyToObject";
export {ErrorHandler} from "./BaseSchema";

/**
 * apply schema to data
 * @param data object to apply
 * @param schemaObject schema objects
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applyTo(data: unknown, schemaObject: SchemaObject, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): object
{
	return applyToObject(data, schemaObject, onError, onFinished, []);
}
