import {NullableRules} from "../libs/publicTypes";
import {ArraySchema, RulesForArray} from "../schemaClasses/ArraySchema";

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
export function array<T>(rules: RulesForArray<T> = {}): ArraySchema<T>
{
	return new ArraySchema<T>(rules);
}
