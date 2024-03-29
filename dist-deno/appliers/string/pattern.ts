import { isString, Key, Values } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
import { REGEXP_EMAIL } from "../../libs/regexp/email.ts";
import { REGEXP_IPV4 } from "../../libs/regexp/ipv4.ts";
import { REGEXP_IPV6 } from "../../libs/regexp/ipv6.ts";
import { REGEXP_HTTP, REGEXP_URI } from "../../libs/regexp/uri.ts";
export const PATTERN = {
    /** email address; compliant with RFC-5321/5322 */
    EMAIL: REGEXP_EMAIL,
    /** HTTP URI; compliant with RFC-3986 */
    HTTP: REGEXP_HTTP,
    /** IPv4 format */
    IPV4: REGEXP_IPV4,
    /** IPv6 format */
    IPV6: REGEXP_IPV6,
    /** URI; compliant with RFC-3986 */
    URI: REGEXP_URI,
    /** UUID format */
    UUID: /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
} as const;
export interface Rules {
    /** acceptable pattern (regular expression) */
    pattern?: RegExp;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string> {
    if (rules.pattern === undefined) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (rules.pattern.test(values.output)) {
        return false;
    }
    return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
}
