import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as transform from "../appliers/transform.ts";
import * as schema from "../appliers/object/schema.ts";
import * as type from "../appliers/object/type.ts";
import { AnyObject, ObjectTypeOf, SchemaObject } from "../libs/types.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type RulesForObject<S> = transform.Rules<AnyObject> & ifUndefined.Rules<AnyObject> & ifEmptyString.Rules<AnyObject> & ifNull.Rules<AnyObject> & schema.Rules<S> & type.Rules;
export class ObjectSchema<S extends SchemaObject, Tx = never> extends BaseSchema<ObjectTypeOf<S> | Tx> {
    constructor(rules: RulesForObject<S>) {
        super(rules, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            schema.applyTo,
            type.applyTo,
            transform.applyTo,
        ]);
    }
}
