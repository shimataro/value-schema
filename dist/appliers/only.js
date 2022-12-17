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
var ValueSchemaError_1 = require("../libs/ValueSchemaError");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  var normalizedRules = __assign({
    only: []
  }, rules);
  if (normalizedRules.only.length === 0) {
    return false;
  }
  // Array.prototype.include() might not exist in old version
  for (var _i = 0, _a = normalizedRules.only; _i < _a.length; _i++) {
    var value = _a[_i];
    if (values.output === value) {
      return true;
    }
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.ONLY, values, keyStack);
}
exports.applyTo = applyTo;