import { REGEXP_EMAIL } from "../../libs/regexp/email.ts";
import { Key, Values } from "../../libs/types.ts";
import * as pattern from "../string/pattern.ts";
export interface Options {
    pattern?: RegExp;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> {
    const normalizedOptions: Required<Options> = {
        pattern: REGEXP_EMAIL,
        ...options
    };
    return pattern.applyTo(values, normalizedOptions, keyStack);
}
