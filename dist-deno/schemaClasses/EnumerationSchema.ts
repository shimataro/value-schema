import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type RulesForEnumeration<E> = ifUndefined.Rules<E> & ifEmptyString.Rules<E> & ifNull.Rules<E> & Required<only.Rules<E>>;
export class EnumerationSchema<E, Tx = never> extends BaseSchema<E | Tx> {
    constructor(rules: RulesForEnumeration<E>) {
        super(rules, [
            ifUndefined.applyTo,
            ifEmptyString.applyTo,
            ifNull.applyTo,
            only.applyTo,
        ]);
    }
}
