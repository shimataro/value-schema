import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as transform from "../appliers/transform.mjs";
import * as each from "../appliers/array/each.mjs";
import * as maxLength from "../appliers/array/maxLength.mjs";
import * as minLength from "../appliers/array/minLength.mjs";
import * as type from "../appliers/array/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export class ArraySchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, type.applyTo, each.applyTo, minLength.applyTo, maxLength.applyTo, transform.applyTo]);
  }
}