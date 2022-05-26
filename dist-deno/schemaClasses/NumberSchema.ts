import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth.ts";
import * as maxValue from "../appliers/number/maxValue.ts";
import * as minValue from "../appliers/number/minValue.ts";
import * as type from "../appliers/number/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export const NUMBER = {
    INTEGER: type.INTEGER
} as const;
export type RulesForNumber = converter.Rules<number> & ifUndefined.Rules<number> & ifEmptyString.Rules<number> & ifNull.Rules<number> & only.Rules<number> & acceptsFullWidth.Rules & type.Rules & minValue.Rules & maxValue.Rules;
export class NumberSchema<Tx = never> extends BaseSchema<number | Tx> {
    constructor(rules: RulesForNumber) {
        super(rules, [
            ifUndefined.applyTo,
            ifEmptyString.applyTo,
            ifNull.applyTo,
            acceptsFullWidth.applyTo,
            type.applyTo,
            only.applyTo,
            minValue.applyTo,
            maxValue.applyTo,
            converter.applyTo,
        ]);
    }
}
