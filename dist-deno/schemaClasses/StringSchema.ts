import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import * as transform from "../appliers/transform.ts";
import * as maxLength from "../appliers/string/maxLength.ts";
import * as minLength from "../appliers/string/minLength.ts";
import * as pattern from "../appliers/string/pattern.ts";
import * as trims from "../appliers/string/trims.ts";
import * as type from "../appliers/string/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export const STRING = {
    PATTERN: pattern.PATTERN
} as const;
export type RulesForString = transform.Rules<string> & ifEmptyString.Rules<string> & ifNull.Rules<string> & ifUndefined.Rules<string> & only.Rules<string> & type.Rules & trims.Rules & minLength.Rules & maxLength.Rules & pattern.Rules;
export class StringSchema<Tx = never> extends BaseSchema<string | Tx> {
    constructor(rules: RulesForString) {
        super(rules, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            type.applyTo,
            trims.applyTo,
            only.applyTo,
            ifEmptyString.applyTo,
            minLength.applyTo,
            maxLength.applyTo,
            pattern.applyTo,
            transform.applyTo,
        ]);
    }
}
