import {SchemaObject, applySchemaObjectCore} from "./applySchemaObjectCore";
import {ErrorHandler, FinishHandler, onErrorDefault, onFinishedDefault} from "./BaseSchema";

export {SchemaObject} from "./applySchemaObjectCore";
export {ErrorHandler} from "./BaseSchema";

/**
 * apply schema object to data
 * @param data data to apply
 * @param schemaObject schema object
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applySchemaObject<T extends object>(data: unknown, schemaObject: SchemaObject, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): T
{
	return applySchemaObjectCore(data, schemaObject, onError, onFinished, []);
}
