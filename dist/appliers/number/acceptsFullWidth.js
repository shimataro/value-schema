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
var string = require("../../libs/string");
var types_1 = require("../../libs/types");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, _keyStack) {
  var normalizedRules = __assign({
    acceptsFullWidth: false
  }, rules);
  if (!normalizedRules.acceptsFullWidth) {
    return false;
  }
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  values.output = string.toHalfWidth(values.output, /[０-９ａ-ｚＡ-Ｚ．＋－]+/g);
  return false;
}
exports.applyTo = applyTo;