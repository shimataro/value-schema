import { Key, ObjectTypeOf, SchemaObject, Values } from "../../libs/types";
export interface Rules<S> {
    /** schema object */
    schemaObject?: S;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
export declare function applyTo<S extends SchemaObject>(values: Values, rules: Rules<S>, keyStack: Key[]): values is Values<ObjectTypeOf<S>>;
