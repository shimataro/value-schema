import { Key, Values } from "./types";
export declare const RULE: {
    readonly TYPE: "type";
    readonly UNDEFINED: "undefined";
    readonly NULL: "null";
    readonly EMPTY_STRING: "empty-string";
    readonly ONLY: "only";
    readonly TRANSFORM: "transform";
    readonly MIN_VALUE: "min-value";
    readonly MAX_VALUE: "max-value";
    readonly MIN_LENGTH: "min-length";
    readonly MAX_LENGTH: "max-length";
    readonly PATTERN: "pattern";
    readonly CHECKSUM: "checksum";
};
type RULE = typeof RULE[keyof typeof RULE];
/**
 * Value-Schema Error
 */
export declare class ValueSchemaError extends Error {
    /** the rule that input value didn't satisfy */
    readonly rule: RULE;
    readonly value: unknown;
    readonly keyStack: Key[];
    /**
     * throw an error
     * @param rule the rule that input value didn't satisfy
     * @param values input/output values
     * @param keyStack path to key that caused error
     * @throws error object
     */
    static raise(rule: RULE, values: Values, keyStack: Key[]): never;
    /**
     * check whether error is instance of ValueSchemaError or not
     * @param err error to check
     * @returns Yes/No
     */
    static is(err: unknown): err is ValueSchemaError;
    /**
     * constructor
     * @param rule the rule that input value didn't satisfy
     * @param value input value
     * @param keyStack path to key that caused error
     */
    constructor(rule: RULE, value: unknown, keyStack: Key[]);
}
export {};
