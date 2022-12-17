"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  var normalizedRules = __assign({
    strictType: false
  }, rules);
  if ((0, types_1.isString)(values.output)) {
    return false;
  }
  // strict type check
  if (normalizedRules.strictType) {
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
  }
  // non-scalar value cannot be converted to string
  if (!(0, types_1.isScalar)(values.output)) {
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
  }
  values.output = String(values.output);
  return false;
}
exports.applyTo = applyTo;