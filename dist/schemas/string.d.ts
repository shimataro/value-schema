import { NullableRules, UndefinableRules } from "../libs/publicTypes";
import { RulesForString, StringSchema } from "../schemaClasses/StringSchema";
export { STRING } from "../schemaClasses/StringSchema";
/** schema for string or null or undefined */
export declare function string(options: RulesForString & NullableRules & UndefinableRules): StringSchema<null | undefined>;
/** schema for string or undefined */
export declare function string(options: RulesForString & UndefinableRules): StringSchema<undefined>;
/** schema for string or null */
export declare function string(rules: RulesForString & NullableRules): StringSchema<null>;
/** schema for string */
export declare function string(rules: RulesForString): StringSchema;
/** schema for string */
export declare function string(): StringSchema;
