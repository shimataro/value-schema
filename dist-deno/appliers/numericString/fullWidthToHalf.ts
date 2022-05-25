import * as string from "../../libs/string.ts";
import { Key, Values, isString } from "../../libs/types.ts";
export interface Options {
    /** converts full width digit to half width */
    fullWidthToHalf?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    const normalizedOptions: Required<Options> = {
        fullWidthToHalf: false,
        ...options
    };
    if (!normalizedOptions.fullWidthToHalf) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    values.output = string.toHalfWidth(values.output, /[０-９]+/g);
    return false;
}
