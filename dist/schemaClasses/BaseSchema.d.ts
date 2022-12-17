import { Key, Values } from "../libs/types";
import { ErrorHandler } from "../libs/publicTypes";
import { ValueSchemaError } from "../libs/ValueSchemaError";
interface Rules {
}
type ApplyTo<T> = (values: Values, rules: Rules, keyStack: Key[]) => values is Values<T>;
/**
 * Base Schema Class
 */
export declare class BaseSchema<T = unknown> {
    private readonly rules;
    private readonly applyToList;
    /**
     * constructor
     * @param rules rules
     * @param applyToList list of applyTo
     */
    constructor(rules: Rules, applyToList: ApplyTo<T>[]);
    /**
     * apply schema
     * @param value value to apply
     * @param onError error handler
     * @returns escapes from applyTo chain or not
     */
    applyTo(value: unknown, onError?: ErrorHandler<T>): T;
    private _applyTo;
}
/**
 * default error handler
 * @param err error object
 */
export declare function onErrorDefault(err: ValueSchemaError): never;
/**
 * default finish handler
 */
export declare function onFinishDefault(): void;
export {};
