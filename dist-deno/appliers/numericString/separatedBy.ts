import { isString, Key, Values } from "../../libs/types.ts";
export interface Rules {
    /** assumes input value is separated by pattern and ignores it */
    separatedBy?: string | RegExp;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<string> {
    if (rules.separatedBy === undefined) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    values.output = values.output.split(rules.separatedBy).join("");
    return false;
}
