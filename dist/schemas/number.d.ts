import { NullableRules, UndefinableRules } from "../libs/publicTypes";
import { NumberSchema, RulesForNumber } from "../schemaClasses/NumberSchema";
export { NUMBER } from "../schemaClasses/NumberSchema";
/** schema for number or null or undefined */
export declare function number(options: RulesForNumber & NullableRules & UndefinableRules): NumberSchema<null | undefined>;
/** schema for number or undefined */
export declare function number(options: RulesForNumber & UndefinableRules): NumberSchema<undefined>;
/** schema for number or null */
export declare function number(rules: RulesForNumber & NullableRules): NumberSchema<null>;
/** schema for number */
export declare function number(rules: RulesForNumber): NumberSchema;
/** schema for number */
export declare function number(): NumberSchema;
