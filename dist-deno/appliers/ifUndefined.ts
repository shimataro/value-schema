import { Key, Values } from "../libs/types.ts";
import { CAUSE, ValueSchemaError } from "../libs/ValueSchemaError.ts";
export interface Options<T> {
    /** value if undefined (defaults: error) */
    ifUndefined?: T | null;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T> {
    if (values.output !== undefined) {
        return false;
    }
    if (options.ifUndefined !== undefined) {
        values.output = options.ifUndefined;
        return true;
    }
    return ValueSchemaError.raise(CAUSE.UNDEFINED, values, keyStack);
}
