import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as transform from "../appliers/transform";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth";
import * as maxValue from "../appliers/number/maxValue";
import * as minValue from "../appliers/number/minValue";
import * as type from "../appliers/number/type";
import { BaseSchema } from "./BaseSchema";
export declare const NUMBER: {
    readonly INTEGER: {
        readonly NO: 0;
        readonly YES: 1;
        readonly FLOOR: 2;
        readonly FLOOR_RZ: 3;
        readonly CEIL: 4;
        readonly CEIL_RI: 5;
        readonly HALF_UP: 6;
        readonly HALF_UP_RZ: 7;
        readonly HALF_DOWN: 8;
        readonly HALF_DOWN_RZ: 9;
    };
};
export type RulesForNumber = transform.Rules<number> & ifUndefined.Rules<number> & ifEmptyString.Rules<number> & ifNull.Rules<number> & only.Rules<number> & acceptsFullWidth.Rules & type.Rules & minValue.Rules & maxValue.Rules;
export declare class NumberSchema<Tx = never> extends BaseSchema<number | Tx> {
    constructor(rules: RulesForNumber);
}
