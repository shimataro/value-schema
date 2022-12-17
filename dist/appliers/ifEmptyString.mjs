import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (values.output !== "") {
    return false;
  }
  if (rules.ifEmptyString !== undefined) {
    values.output = rules.ifEmptyString;
    return true;
  }
  return ValueSchemaError.raise(RULE.EMPTY_STRING, values, keyStack);
}