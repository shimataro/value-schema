import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as each from "../appliers/array/each.ts";
import * as maxLength from "../appliers/array/maxLength.ts";
import * as minLength from "../appliers/array/minLength.ts";
import * as type from "../appliers/array/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type RulesForArray<T> = converter.Rules<T[]> & ifUndefined.Rules<T[]> & ifEmptyString.Rules<T[]> & ifNull.Rules<T[]> & each.Rules<T> & minLength.Rules & maxLength.Rules & type.Rules;
export class ArraySchema<T, Tx = never> extends BaseSchema<T[] | Tx> {
    constructor(rules: RulesForArray<T>) {
        super(rules, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            type.applyTo,
            each.applyTo,
            minLength.applyTo,
            maxLength.applyTo,
            converter.applyTo,
        ]);
    }
}
