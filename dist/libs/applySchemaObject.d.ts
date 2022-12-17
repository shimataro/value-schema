import { ErrorHandler, FinishHandler } from "./publicTypes";
import { ObjectTypeOf, SchemaObject } from "./types";
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @returns applied data
 */
export declare function applySchemaObject<S extends SchemaObject>(schemaObject: S, data: unknown, onError?: ErrorHandler, onFinishWithError?: FinishHandler): ObjectTypeOf<S>;
