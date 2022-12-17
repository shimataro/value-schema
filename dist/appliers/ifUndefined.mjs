import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (values.output !== undefined) {
    return false;
  }
  if (!rules.hasOwnProperty("ifUndefined")) {
    return ValueSchemaError.raise(RULE.UNDEFINED, values, keyStack);
  }
  values.output = rules.ifUndefined;
  return true;
}