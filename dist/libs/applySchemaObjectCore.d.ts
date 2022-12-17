import { ErrorHandler, FinishHandler } from "./publicTypes";
import { Key, ObjectTypeOf, SchemaObject } from "./types";
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @param keyStack path to key that caused error
 * @returns applied data
 */
export declare function applySchemaObjectCore<S extends SchemaObject>(schemaObject: S, data: unknown, onError: ErrorHandler, onFinishWithError: FinishHandler, keyStack: Key[]): ObjectTypeOf<S>;
