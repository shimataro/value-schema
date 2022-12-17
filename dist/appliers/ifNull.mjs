import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (values.output !== null) {
    return false;
  }
  if (rules.ifNull !== undefined) {
    values.output = rules.ifNull;
    return true;
  }
  return ValueSchemaError.raise(RULE.NULL, values, keyStack);
}