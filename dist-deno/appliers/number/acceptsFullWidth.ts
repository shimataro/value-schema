import * as string from "../../libs/string.ts";
import { Key, Values, isString } from "../../libs/types.ts";
export interface Options {
    acceptsFullWidth?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<number> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    const normalizedOptions: Required<Options> = {
        acceptsFullWidth: false,
        ...options
    };
    if (!normalizedOptions.acceptsFullWidth) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    values.output = string.toHalfWidth(values.output, /[０-９ａ-ｚＡ-Ｚ．＋－]+/g);
    return false;
}
