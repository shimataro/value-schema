import { isBoolean, isNumber, isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const normalizedRules = {
    strictType: false,
    acceptsAllNumbers: false,
    ...rules
  };
  if (isBoolean(values.output)) {
    // already boolean
    return true;
  }
  // not boolean
  if (normalizedRules.strictType) {
    // strict type check
    ValueSchemaError.raise(RULE.TYPE, values, keyStack);
  }
  if (isString(values.output)) {
    // "true" is true, "false" is false
    if (REGEXP_TRUE.test(values.output)) {
      values.output = true;
      return true;
    }
    if (REGEXP_FALSE.test(values.output)) {
      values.output = false;
      return true;
    }
    // convert to number
    values.output = Number(values.output);
  }
  if (isNumber(values.output)) {
    if (values.output === 0 || values.output === 1 || normalizedRules.acceptsAllNumbers) {
      values.output = Boolean(values.output);
      return true;
    }
  }
  return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}