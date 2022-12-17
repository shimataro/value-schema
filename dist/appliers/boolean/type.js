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
var REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
var REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  var normalizedRules = __assign({
    strictType: false,
    acceptsAllNumbers: false
  }, rules);
  if ((0, types_1.isBoolean)(values.output)) {
    // already boolean
    return true;
  }
  // not boolean
  if (normalizedRules.strictType) {
    // strict type check
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
  }
  if ((0, types_1.isString)(values.output)) {
    // "true" is true, "false" is false
    if (REGEXP_TRUE.test(values.output)) {
      values.output = true;
      return true;
    }
    if (REGEXP_FALSE.test(values.output)) {
      values.output = false;
      return true;
    }
    // convert to number
    values.output = Number(values.output);
  }
  if ((0, types_1.isNumber)(values.output)) {
    if (values.output === 0 || values.output === 1 || normalizedRules.acceptsAllNumbers) {
      values.output = Boolean(values.output);
      return true;
    }
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
}
exports.applyTo = applyTo;