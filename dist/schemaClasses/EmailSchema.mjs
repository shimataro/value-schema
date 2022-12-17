import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as maxLength from "../appliers/email/maxLength.mjs";
import * as pattern from "../appliers/email/pattern.mjs";
import * as trims from "../appliers/string/trims.mjs";
import * as type from "../appliers/string/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export class EmailSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, type.applyTo, trims.applyTo, ifEmptyString.applyTo, maxLength.applyTo, pattern.applyTo]);
  }
}