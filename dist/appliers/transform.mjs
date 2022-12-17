import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.mjs";
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values, rules, keyStack) {
  if (rules.transform === undefined) {
    return false;
  }
  values.output = rules.transform(values.output, () => {
    return ValueSchemaError.raise(RULE.TRANSFORM, values, keyStack);
  });
  return true;
}