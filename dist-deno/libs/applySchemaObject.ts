import { applySchemaObjectCore } from "./applySchemaObjectCore.ts";
import { ErrorHandler, FinishHandler } from "./publicTypes.ts";
import { ObjectTypeOf, SchemaObject } from "./types.ts";
import { onErrorDefault, onFinishDefault } from "../schemaClasses/BaseSchema.ts";
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @returns applied data
 */
export function applySchemaObject<S extends SchemaObject>(schemaObject: S, data: unknown, onError: ErrorHandler = onErrorDefault, onFinishWithError: FinishHandler = onFinishDefault): ObjectTypeOf<S> {
    return applySchemaObjectCore(schemaObject, data, onError, onFinishWithError, []);
}
