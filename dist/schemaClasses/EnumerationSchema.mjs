import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as only from "../appliers/only.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export class EnumerationSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifEmptyString.applyTo, ifNull.applyTo, only.applyTo]);
  }
}