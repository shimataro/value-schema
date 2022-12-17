import { EmailSchema, RulesForEmail } from "../schemaClasses/EmailSchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
/** schema for email or null or undefined */
export declare function email(options: RulesForEmail & NullableRules & UndefinableRules): EmailSchema<null | undefined>;
/** schema for email or undefined */
export declare function email(options: RulesForEmail & UndefinableRules): EmailSchema<undefined>;
/** schema for email or null */
export declare function email(rules: RulesForEmail & NullableRules): EmailSchema<null>;
/** schema for email */
export declare function email(rules: RulesForEmail): EmailSchema;
/** schema for email */
export declare function email(): EmailSchema;
