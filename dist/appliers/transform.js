"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var ValueSchemaError_1 = require("../libs/ValueSchemaError");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  if (rules.transform === undefined) {
    return false;
  }
  values.output = rules.transform(values.output, function () {
    return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TRANSFORM, values, keyStack);
  });
  return true;
}
exports.applyTo = applyTo;