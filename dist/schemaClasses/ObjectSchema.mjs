import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as transform from "../appliers/transform.mjs";
import * as schema from "../appliers/object/schema.mjs";
import * as type from "../appliers/object/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export class ObjectSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, schema.applyTo, type.applyTo, transform.applyTo]);
  }
}