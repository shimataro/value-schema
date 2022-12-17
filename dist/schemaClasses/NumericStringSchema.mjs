import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as transform from "../appliers/transform.mjs";
import * as checksum from "../appliers/numericString/checksum.mjs";
import * as fullWidthToHalf from "../appliers/numericString/fullWidthToHalf.mjs";
import * as joinsArray from "../appliers/numericString/joinsArray.mjs";
import * as pattern from "../appliers/numericString/pattern.mjs";
import * as separatedBy from "../appliers/numericString/separatedBy.mjs";
import * as maxLength from "../appliers/string/maxLength.mjs";
import * as minLength from "../appliers/string/minLength.mjs";
import * as type from "../appliers/string/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export const NUMERIC_STRING = {
  CHECKSUM_ALGORITHM: checksum.CHECKSUM_ALGORITHM
};
export class NumericStringSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, fullWidthToHalf.applyTo, joinsArray.applyTo, type.applyTo, separatedBy.applyTo, pattern.applyTo, minLength.applyTo, maxLength.applyTo, checksum.applyTo, transform.applyTo]);
  }
}