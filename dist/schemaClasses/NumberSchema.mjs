import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as only from "../appliers/only.mjs";
import * as transform from "../appliers/transform.mjs";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth.mjs";
import * as maxValue from "../appliers/number/maxValue.mjs";
import * as minValue from "../appliers/number/minValue.mjs";
import * as type from "../appliers/number/type.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export const NUMBER = {
  INTEGER: type.INTEGER
};
export class NumberSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifEmptyString.applyTo, ifNull.applyTo, acceptsFullWidth.applyTo, type.applyTo, only.applyTo, minValue.applyTo, maxValue.applyTo, transform.applyTo]);
  }
}