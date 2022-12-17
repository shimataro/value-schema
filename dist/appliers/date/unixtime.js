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
exports.applyTo = exports.UNIXTIME = void 0;
var types_1 = require("../../libs/types");
var PRECISION = {
  MILLISECONDS: 0,
  SECONDS: 1,
  MINUTES: 2
};
exports.UNIXTIME = {
  /** precision of unixtime */
  PRECISION: PRECISION
};
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, _keyStack) {
  // skip if "unixtime-mode" is disabled
  if (rules.unixtime === undefined) {
    return false;
  }
  var normalizedUnixtime = __assign({
    strictType: false
  }, rules.unixtime);
  if (!normalizedUnixtime.strictType && (0, types_1.isNumericString)(values.output)) {
    // convert to number
    values.output = Number(values.output);
  }
  if (!(0, types_1.isNumber)(values.output)) {
    return false;
  }
  if (Number.isInteger(values.output) && !Number.isSafeInteger(values.output)) {
    // integer but not safe
    return false;
  }
  switch (normalizedUnixtime.precision) {
    case exports.UNIXTIME.PRECISION.MILLISECONDS:
      values.output = new Date(values.output);
      return false;
    case exports.UNIXTIME.PRECISION.SECONDS:
      values.output = new Date(values.output * 1000);
      return false;
    case exports.UNIXTIME.PRECISION.MINUTES:
      values.output = new Date(values.output * 1000 * 60);
      return false;
  }
  return false;
}
exports.applyTo = applyTo;