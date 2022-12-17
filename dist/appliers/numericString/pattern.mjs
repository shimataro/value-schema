import { isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
const REGEXP = /^\d+$/;
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, _rules, keyStack) {
  // istanbul ignore next
  if (!isString(values.output)) {
    return false;
  }
  if (REGEXP.test(values.output)) {
    return false;
  }
  return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
}