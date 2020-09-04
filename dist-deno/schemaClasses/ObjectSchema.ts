import * as converter from "../appliers/converter.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as schema from "../appliers/object/schema.ts";
import * as type from "../appliers/object/type.ts";
import { AnyObject, ObjectTypeOf, SchemaObject } from "../libs/types.ts";
import { BaseSchema } from "./BaseSchema.ts";
export { NullableOptions } from "./BaseSchema.ts";
export type OptionsForObject<S> = converter.Options<AnyObject> | ifUndefined.Options<AnyObject> | ifEmptyString.Options<AnyObject> | ifNull.Options<AnyObject> | schema.Options<S> | type.Options;
export class ObjectSchema<S extends SchemaObject, Tx = never> extends BaseSchema<ObjectTypeOf<S> | Tx> {
    constructor(options: OptionsForObject<S>) {
        super(options, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            schema.applyTo,
            type.applyTo,
            converter.applyTo,
        ]);
    }
}
