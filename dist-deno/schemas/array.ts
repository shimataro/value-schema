import { NullableRules, UndefinableRules } from "../libs/publicTypes.ts";
import { ArraySchema, RulesForArray } from "../schemaClasses/ArraySchema.ts";
/** schema for array or null or undefined */
export function array<T>(options: RulesForArray<T> & NullableRules & UndefinableRules): ArraySchema<T, null | undefined>;
/** schema for array or undefined */
export function array<T>(options: RulesForArray<T> & UndefinableRules): ArraySchema<T, undefined>;
/** schema for array or null */
export function array<T>(rules: RulesForArray<T> & NullableRules): ArraySchema<T, null>;
/** schema for array */
export function array<T>(rules: RulesForArray<T>): ArraySchema<T>;
/** schema for array */
export function array<T>(): ArraySchema<T>;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function array<T>(rules: RulesForArray<T> = {}): ArraySchema<T> {
    return new ArraySchema<T>(rules);
}
