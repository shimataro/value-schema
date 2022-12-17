import * as ifEmptyString from "../appliers/ifEmptyString.mjs";
import * as ifNull from "../appliers/ifNull.mjs";
import * as ifUndefined from "../appliers/ifUndefined.mjs";
import * as transform from "../appliers/transform.mjs";
import * as iso8601 from "../appliers/date/iso8601.mjs";
import * as maxValue from "../appliers/date/maxValue.mjs";
import * as minValue from "../appliers/date/minValue.mjs";
import * as type from "../appliers/date/type.mjs";
import * as unixtime from "../appliers/date/unixtime.mjs";
import { BaseSchema } from "./BaseSchema.mjs";
export const DATE = {
  UNIXTIME: unixtime.UNIXTIME
};
export class DateSchema extends BaseSchema {
  constructor(rules) {
    super(rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, unixtime.applyTo, iso8601.applyTo, maxValue.applyTo, minValue.applyTo, type.applyTo, transform.applyTo]);
  }
}