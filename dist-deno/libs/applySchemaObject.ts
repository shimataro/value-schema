import { applySchemaObjectCore, Handlers } from "./applySchemaObjectCore.ts";
import { ObjectTypeOf, SchemaObject } from "./types.ts";
import { onErrorDefault, onFinishDefault } from "../schemaClasses/BaseSchema.ts";
type PartialHandlers = Partial<Handlers>;
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param handlers handlers
 * @returns applied data
 */
export function applySchemaObject<S extends SchemaObject>(schemaObject: S, data: unknown, handlers: PartialHandlers = {}): ObjectTypeOf<S> {
    const normalizedHandlers: Handlers = {
        onError: onErrorDefault,
        onFinishSuccessfully: onFinishDefault,
        onFinishFaultily: onFinishDefault,
        ...handlers
    };
    return applySchemaObjectCore(schemaObject, data, normalizedHandlers, []);
}
