import { ErrorHandler, FinishHandler } from "./publicTypes.ts";
import { AnyObject, isObject, Key, ObjectTypeOf, SchemaObject } from "./types.ts";
import { RULE, ValueSchemaError } from "./ValueSchemaError.ts";
export interface Handlers {
    onError: ErrorHandler;
    onFinishSuccessfully: FinishHandler;
    onFinishFaultily: FinishHandler;
}
/**
 * apply schema object to data
 * @param schemaObject schema object
 * @param data data to apply
 * @param handlers handlers
 * @param keyStack path to key that caused error
 * @returns applied data
 */
export function applySchemaObjectCore<S extends SchemaObject>(schemaObject: S, data: unknown, handlers: Handlers, keyStack: Key[]): ObjectTypeOf<S> {
    if (!isObject(data)) {
        const err = new ValueSchemaError(RULE.TYPE, data, keyStack);
        const result = handlers.onError(err);
        if (!isObject(result)) {
            throw err;
        }
        handlers.onFinishFaultily();
        return result as ObjectTypeOf<S>;
    }
    const appliedObject: AnyObject = {};
    let hasErrors = false;
    for (const key of Object.keys(schemaObject)) {
        // A trick in order to call _applyTo() private method from the outside (like "friend" in C++)
        appliedObject[key] = schemaObject[key]["_applyTo"](data[key], onError, [...keyStack, key]);
    }
    if (hasErrors) {
        handlers.onFinishFaultily();
    }
    else {
        handlers.onFinishSuccessfully();
    }
    return appliedObject as ObjectTypeOf<S>;
    /**
     * error handler (to avoid "no-loop-func" error on eslint)
     * @param err error object
     * @returns error handler
     */
    function onError(err: ValueSchemaError): unknown | void {
        hasErrors = true;
        return handlers.onError(err);
    }
}
