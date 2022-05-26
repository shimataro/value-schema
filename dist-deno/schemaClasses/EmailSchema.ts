import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as maxLength from "../appliers/email/maxLength.ts";
import * as pattern from "../appliers/email/pattern.ts";
import * as trims from "../appliers/string/trims.ts";
import * as type from "../appliers/string/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type RulesForEmail = ifEmptyString.Rules<string> & ifNull.Rules<string> & ifUndefined.Rules<string> & pattern.Rules & maxLength.Rules & trims.Rules & type.Rules;
export class EmailSchema<Tx = never> extends BaseSchema<string | Tx> {
    constructor(rules: RulesForEmail) {
        super(rules, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            type.applyTo,
            trims.applyTo,
            ifEmptyString.applyTo,
            maxLength.applyTo,
            pattern.applyTo,
        ]);
    }
}
