import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import { BaseSchema } from "./BaseSchema";
export type RulesForEnumeration<E> = ifUndefined.Rules<E> & ifEmptyString.Rules<E> & ifNull.Rules<E> & Required<only.Rules<E>>;
export declare class EnumerationSchema<E, Tx = never> extends BaseSchema<E | Tx> {
    constructor(rules: RulesForEnumeration<E>);
}
