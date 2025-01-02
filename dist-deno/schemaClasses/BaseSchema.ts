import { Key, makeValues, Values } from "../libs/types.ts";
import { ErrorHandler } from "../libs/publicTypes.ts";
import { ValueSchemaError } from "../libs/ValueSchemaError.ts";
type Rules = object;
type ApplyTo<T> = (values: Values, rules: Rules, keyStack: Key[]) => values is Values<T>;
/**
 * Base Schema Class
 */
export class BaseSchema<T = unknown> {
    private readonly rules: Rules;
    private readonly applyToList: ApplyTo<T>[];
    /**
     * constructor
     * @param rules rules
     * @param applyToList list of applyTo
     */
    constructor(rules: Rules, applyToList: ApplyTo<T>[]) {
        this.rules = rules;
        this.applyToList = applyToList;
    }
    /**
     * apply schema
     * @param value value to apply
     * @param onError error handler
     * @returns escapes from applyTo chain or not
     */
    applyTo(value: unknown, onError: ErrorHandler<T> = onErrorDefault): T {
        return this._applyTo(value, onError, []);
    }
    private _applyTo(value: unknown, onError: ErrorHandler<T>, keyStack: Key[]): T {
        try {
            const values = makeValues(value);
            for (const applyTo of this.applyToList) {
                if (applyTo(values, this.rules, keyStack)) {
                    return values.output;
                }
            }
            return values.output as T;
        }
        catch (err) {
            return onError(err as ValueSchemaError);
        }
    }
    /**
     * get a "mapped" property
     * @param defaultProperty default property
     * @returns mapped property
     * @see Rules (appliers/map.ts)
     * @protected in order to repress TS6133 error
     */
    protected _getProperty(defaultProperty: string): string {
        if ("map" in this.rules) {
            if (typeof this.rules.map === "string") {
                return this.rules.map;
            }
        }
        return defaultProperty;
    }
}
/**
 * default error handler
 * @param err error object
 */
export function onErrorDefault(err: ValueSchemaError): never {
    throw err;
}
/**
 * default finish handler
 */
export function onFinishDefault(): void {
    // do nothing
}
