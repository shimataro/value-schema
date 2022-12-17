import { isString } from "../../libs/types.mjs";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const normalizedRules = {
    minLength: 0,
    ...rules
  };
  // istanbul ignore next
  if (!isString(values.output)) {
    return false;
  }
  if (values.output.length >= normalizedRules.minLength) {
    return false;
  }
  return ValueSchemaError.raise(RULE.MIN_LENGTH, values, keyStack);
}