import { ObjectSchema, RulesForObject } from "../schemaClasses/ObjectSchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
import { SchemaObject } from "../libs/types";
/** schema for object or null or undefined */
export declare function object<S extends SchemaObject>(options: RulesForObject<S> & NullableRules & UndefinableRules): ObjectSchema<S, null | undefined>;
/** schema for object or undefined */
export declare function object<S extends SchemaObject>(options: RulesForObject<S> & UndefinableRules): ObjectSchema<S, undefined>;
/** schema for object or null */
export declare function object<S extends SchemaObject>(rules: RulesForObject<S> & NullableRules): ObjectSchema<S, null>;
/** schema for object */
export declare function object<S extends SchemaObject>(rules: RulesForObject<S>): ObjectSchema<S>;
/** schema for object */
export declare function object(): ObjectSchema<SchemaObject>;
