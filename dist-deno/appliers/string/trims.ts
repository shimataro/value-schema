import { Key, Values, isString } from "../../libs/types.ts";
export interface Options {
    /** removes whitespace from both ends of a string */
    trims?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    const normalizedOptions: Required<Options> = {
        trims: false,
        ...options
    };
    if (!normalizedOptions.trims) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    values.output = values.output.trim();
    return false;
}
