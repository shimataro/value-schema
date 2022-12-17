import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as transform from "../appliers/transform";
import * as maxLength from "../appliers/string/maxLength";
import * as minLength from "../appliers/string/minLength";
import * as pattern from "../appliers/string/pattern";
import * as trims from "../appliers/string/trims";
import * as type from "../appliers/string/type";
import { BaseSchema } from "./BaseSchema";
export declare const STRING: {
    readonly PATTERN: {
        readonly EMAIL: RegExp;
        readonly HTTP: RegExp;
        readonly IPV4: RegExp;
        readonly IPV6: RegExp;
        readonly URI: RegExp;
        readonly UUID: RegExp;
    };
};
export type RulesForString = transform.Rules<string> & ifEmptyString.Rules<string> & ifNull.Rules<string> & ifUndefined.Rules<string> & only.Rules<string> & type.Rules & trims.Rules & minLength.Rules & maxLength.Rules & pattern.Rules;
export declare class StringSchema<Tx = never> extends BaseSchema<string | Tx> {
    constructor(rules: RulesForString);
}
