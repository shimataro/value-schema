import {SchemaObject, applySchemaCore} from "./applySchemaCore";
import {ErrorHandler, FinishHandler, onErrorDefault, onFinishedDefault} from "./BaseSchema";

export {SchemaObject} from "./applySchemaCore";
export {ErrorHandler} from "./BaseSchema";

/**
 * apply schema to data
 * @param data object to apply
 * @param schemaObject schema objects
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applySchema<T extends object>(data: unknown, schemaObject: SchemaObject, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): T
{
	return applySchemaCore(data, schemaObject, onError, onFinished, []);
}
