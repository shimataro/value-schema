import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as transform from "../appliers/transform";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";
import { AnyObject, ObjectTypeOf, SchemaObject } from "../libs/types";
import { BaseSchema } from "./BaseSchema";
export type RulesForObject<S> = transform.Rules<AnyObject> & ifUndefined.Rules<AnyObject> & ifEmptyString.Rules<AnyObject> & ifNull.Rules<AnyObject> & schema.Rules<S> & type.Rules;
export declare class ObjectSchema<S extends SchemaObject, Tx = never> extends BaseSchema<ObjectTypeOf<S> | Tx> {
    constructor(rules: RulesForObject<S>);
}
