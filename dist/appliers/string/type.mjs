import { isScalar, isString } from "../../libs/types.mjs";
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
    strictType: false,
    ...rules
  };
  if (isString(values.output)) {
    return false;
  }
  // strict type check
  if (normalizedRules.strictType) {
    ValueSchemaError.raise(RULE.TYPE, values, keyStack);
  }
  // non-scalar value cannot be converted to string
  if (!isScalar(values.output)) {
    ValueSchemaError.raise(RULE.TYPE, values, keyStack);
  }
  values.output = String(values.output);
  return false;
}