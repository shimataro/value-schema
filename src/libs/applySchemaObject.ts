import {applySchemaObjectCore} from "./applySchemaObjectCore";
import {ErrorHandler, FinishHandler} from "./publicTypes";
import {ObjectTypeOf, SchemaObject} from "./types";

import {onErrorDefault, onFinishedDefault} from "../schemaClasses/BaseSchema";

/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinished finish handler
 * @returns applied data
 */
export function applySchemaObject<S extends SchemaObject>(schemaObject: S, data: unknown, onError: ErrorHandler = onErrorDefault, onFinished: FinishHandler = onFinishedDefault): ObjectTypeOf<S>
{
	return applySchemaObjectCore(schemaObject, data, onError, onFinished, []);
}
