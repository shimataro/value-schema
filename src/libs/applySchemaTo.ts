import {SchemaObject, applySchemaToCore} from "./applySchemaToCore";
import {ErrorHandler, FinishHandler, onErrorDefault, onFinishedDefault} from "./BaseSchema";

export {SchemaObject} from "./applySchemaToCore";
export {ErrorHandler} from "./BaseSchema";

/**
 * apply schema to data
 * @param data object to apply
 * @param schemaObject schema objects
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applySchemaTo<T extends object>(data: unknown, schemaObject: SchemaObject, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): T
{
	return applySchemaToCore(data, schemaObject, onError, onFinished, []);
}
