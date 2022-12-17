import { NullableRules, UndefinableRules } from "../libs/publicTypes";
import { NumericStringSchema, RulesForNumericString } from "../schemaClasses/NumericStringSchema";
export { NUMERIC_STRING } from "../schemaClasses/NumericStringSchema";
/** schema for numeric string or null or undefined */
export declare function numericString(options: RulesForNumericString & NullableRules & UndefinableRules): NumericStringSchema<null | undefined>;
/** schema for numeric string or undefined */
export declare function numericString(options: RulesForNumericString & UndefinableRules): NumericStringSchema<undefined>;
/** schema for numeric string or null */
export declare function numericString(rules: RulesForNumericString & NullableRules): NumericStringSchema<null>;
/** schema for numeric string */
export declare function numericString(rules: RulesForNumericString): NumericStringSchema;
/** schema for numeric string */
export declare function numericString(): NumericStringSchema;
