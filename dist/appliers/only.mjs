import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  const normalizedRules = {
    only: [],
    ...rules
  };
  if (normalizedRules.only.length === 0) {
    return false;
  }
  // Array.prototype.include() might not exist in old version
  for (const value of normalizedRules.only) {
    if (values.output === value) {
      return true;
    }
  }
  return ValueSchemaError.raise(RULE.ONLY, values, keyStack);
}