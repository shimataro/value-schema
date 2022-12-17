import { ArraySchema, RulesForArray } from "../schemaClasses/ArraySchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
/** schema for array or null or undefined */
export declare function array<T>(options: RulesForArray<T> & NullableRules & UndefinableRules): ArraySchema<T, null | undefined>;
/** schema for array or undefined */
export declare function array<T>(options: RulesForArray<T> & UndefinableRules): ArraySchema<T, undefined>;
/** schema for array or null */
export declare function array<T>(rules: RulesForArray<T> & NullableRules): ArraySchema<T, null>;
/** schema for array */
export declare function array<T>(rules: RulesForArray<T>): ArraySchema<T>;
/** schema for array */
export declare function array<T>(): ArraySchema<T>;
