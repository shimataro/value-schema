import {SchemaObject, applySchemaObjectCore} from "./applySchemaObjectCore";
import {ErrorHandler, FinishHandler, onErrorDefault, onFinishedDefault} from "./BaseSchema";

import {Empty} from "../libs/types";

export {SchemaObject} from "./applySchemaObjectCore";
export {ErrorHandler} from "./BaseSchema";

/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applySchemaObject<T extends Empty>(schemaObject: SchemaObject, data: unknown, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): T
{
	return applySchemaObjectCore(schemaObject, data, onError, onFinished, []);
}
