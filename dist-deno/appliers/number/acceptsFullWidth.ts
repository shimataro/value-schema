import * as string from "../../libs/string.ts";
import { Key, Values, isString } from "../../libs/types.ts";
export interface Rules {
    /** accepts full width string; e.g., "１２３４５" */
    acceptsFullWidth?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<number> {
    const normalizedRules: Required<Rules> = {
        acceptsFullWidth: false,
        ...rules
    };
    if (!normalizedRules.acceptsFullWidth) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    values.output = string.toHalfWidth(values.output, /[０-９ａ-ｚＡ-Ｚ．＋－]+/g);
    return false;
}
