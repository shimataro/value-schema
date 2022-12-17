import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as transform from "../appliers/transform";
import * as iso8601 from "../appliers/date/iso8601";
import * as maxValue from "../appliers/date/maxValue";
import * as minValue from "../appliers/date/minValue";
import * as unixtime from "../appliers/date/unixtime";
import { BaseSchema } from "./BaseSchema";
export declare const DATE: {
    readonly UNIXTIME: {
        readonly PRECISION: {
            readonly MILLISECONDS: 0;
            readonly SECONDS: 1;
            readonly MINUTES: 2;
        };
    };
};
export type RulesForDate = transform.Rules<Date> & ifUndefined.Rules<Date> & ifEmptyString.Rules<Date> & ifNull.Rules<Date> & iso8601.Rules & maxValue.Rules & minValue.Rules & unixtime.Rules;
export declare class DateSchema<Tx = never> extends BaseSchema<Date | Tx> {
    constructor(rules: RulesForDate);
}
