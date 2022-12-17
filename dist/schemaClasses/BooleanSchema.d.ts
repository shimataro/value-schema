import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as type from "../appliers/boolean/type";
import { BaseSchema } from "./BaseSchema";
export type RulesForBoolean = ifUndefined.Rules<boolean> & ifEmptyString.Rules<boolean> & ifNull.Rules<boolean> & type.Rules;
export declare class BooleanSchema<Tx = never> extends BaseSchema<boolean | Tx> {
    constructor(rules: RulesForBoolean);
}
