import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as type from "../appliers/boolean/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export class BooleanSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifEmptyString.applyTo, ifNull.applyTo, type.applyTo]);
  }
}