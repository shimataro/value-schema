import { DateSchema, RulesForDate } from "../schemaClasses/DateSchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
export { DATE } from "../schemaClasses/DateSchema";
/** schema for number or null or undefined */
export declare function date(options: RulesForDate & NullableRules & UndefinableRules): DateSchema<null | undefined>;
/** schema for number or undefined */
export declare function date(options: RulesForDate & UndefinableRules): DateSchema<undefined>;
/** schema for number or null */
export declare function date(rules: RulesForDate & NullableRules): DateSchema<null>;
/** schema for number */
export declare function date(rules: RulesForDate): DateSchema;
/** schema for number */
export declare function date(): DateSchema;
