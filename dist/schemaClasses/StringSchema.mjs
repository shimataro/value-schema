import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as only from "../appliers/only.mjs";
import * as transform from "../appliers/transform.mjs";
import * as maxLength from "../appliers/string/maxLength.mjs";
import * as minLength from "../appliers/string/minLength.mjs";
import * as pattern from "../appliers/string/pattern.mjs";
import * as trims from "../appliers/string/trims.mjs";
import * as type from "../appliers/string/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export const STRING = {
  PATTERN: pattern.PATTERN
};
export class StringSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, type.applyTo, trims.applyTo, only.applyTo, ifEmptyString.applyTo, minLength.applyTo, maxLength.applyTo, pattern.applyTo, transform.applyTo]);
  }
}