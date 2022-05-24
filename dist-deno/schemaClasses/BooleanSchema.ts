import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as type from "../appliers/boolean/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type RulesForBoolean = ifUndefined.Rules<boolean> & ifEmptyString.Rules<boolean> & ifNull.Rules<boolean> & type.Rules;
export class BooleanSchema<Tx = never> extends BaseSchema<boolean | Tx> {
    constructor(rules: RulesForBoolean) {
        super(rules, [
            ifUndefined.applyTo,
            ifEmptyString.applyTo,
            ifNull.applyTo,
            type.applyTo,
        ]);
    }
}
