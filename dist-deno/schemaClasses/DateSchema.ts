import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as iso8601 from "../appliers/date/iso8601.ts";
import * as maxValue from "../appliers/date/maxValue.ts";
import * as minValue from "../appliers/date/minValue.ts";
import * as unixtime from "../appliers/date/unixtime.ts";
import * as type from "../appliers/date/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export const DATE = {
    UNIXTIME: unixtime.UNIXTIME
} as const;
export type RulesForDate = converter.Rules<Date> & ifUndefined.Rules<Date> & ifEmptyString.Rules<Date> & ifNull.Rules<Date> & iso8601.Rules & maxValue.Rules & minValue.Rules & unixtime.Rules;
export class DateSchema<Tx = never> extends BaseSchema<Date | Tx> {
    constructor(rules: RulesForDate) {
        super(rules, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            unixtime.applyTo,
            iso8601.applyTo,
            maxValue.applyTo,
            minValue.applyTo,
            type.applyTo,
            converter.applyTo,
        ]);
    }
}
