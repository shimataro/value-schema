import { applySchemaObjectCore } from "./applySchemaObjectCore.mjs";
import { onErrorDefault, onFinishDefault } from "../schemaClasses/BaseSchema.mjs";
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param onError error handler
 * @param onFinishWithError finish handler
 * @returns applied data
 */
export function applySchemaObject(schemaObject, data, onError = onErrorDefault, onFinishWithError = onFinishDefault) {
  return applySchemaObjectCore(schemaObject, data, onError, onFinishWithError, []);
}