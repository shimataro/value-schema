import { BooleanSchema, RulesForBoolean } from "../schemaClasses/BooleanSchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
/** schema for boolean or null or undefined */
export declare function boolean(options: RulesForBoolean & NullableRules & UndefinableRules): BooleanSchema<null | undefined>;
/** schema for boolean or undefined */
export declare function boolean(options: RulesForBoolean & UndefinableRules): BooleanSchema<undefined>;
/** schema for boolean or null */
export declare function boolean(rules: RulesForBoolean & NullableRules): BooleanSchema<null>;
/** schema for boolean */
export declare function boolean(rules: RulesForBoolean): BooleanSchema;
/** schema for boolean */
export declare function boolean(): BooleanSchema;
