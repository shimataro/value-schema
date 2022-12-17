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
exports.applyTo = exports.INTEGER = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
var REGEXP_NUMBER = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;
var REGEXP_INTEGER = /^\s*[+-]?\d+\s*$/;
exports.INTEGER = {
  /** does not care */
  NO: 0,
  /** must be integer; causes error if otherwise */
  YES: 1,
  /** rounds down (towards minus infinity) */
  FLOOR: 2,
  /** rounds towards 0 (away from infinity) */
  FLOOR_RZ: 3,
  /** rounds up (towards plus infinity) */
  CEIL: 4,
  /** rounds away from 0 (towards infinity) */
  CEIL_RI: 5,
  /** rounds half up (towards positive infinity) */
  HALF_UP: 6,
  /** rounds half towards zero (away from infinity) */
  HALF_UP_RZ: 7,
  /** rounds half down (towards negative infinity) */
  HALF_DOWN: 8,
  /** rounds half away from zero (towards infinity) */
  HALF_DOWN_RZ: 9
};
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
    acceptsSpecialFormats: false,
    integer: false
  }, rules);
  if ((0, types_1.isString)(values.output)) {
    if (!checkNumberFormat(normalizedRules, values.output)) {
      ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
    }
  }
  var adjustedValue = toNumber(normalizedRules, values.output);
  if (adjustedValue === false) {
    ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
  }
  values.output = adjustedValue;
  return false;
}
exports.applyTo = applyTo;
/**
 * check the format of value
 * @param rules rules
 * @param value value to check
 * @returns OK/NG
 */
function checkNumberFormat(rules, value) {
  var re = getRegExpForNumber(rules);
  if (re === null) {
    return true;
  }
  return re.test(value);
}
/**
 * get RegExp pattern for number
 * @param rules rules
 * @returns regular expression pattern
 */
function getRegExpForNumber(rules) {
  if (rules.acceptsSpecialFormats) {
    return null;
  }
  if (rules.integer === true || rules.integer === exports.INTEGER.YES) {
    // integer
    return REGEXP_INTEGER;
  }
  // number
  return REGEXP_NUMBER;
}
/**
 * convert to number
 * @param rules rules
 * @param value value to convert
 * @returns converted value or false(if failed)
 */
function toNumber(rules, value) {
  // strict type check
  if (!(0, types_1.isNumber)(value) && rules.strictType) {
    return false;
  }
  if (!(0, types_1.isScalar)(value)) {
    // not a scalar value
    return false;
  }
  var convertedValue = Number(value);
  if (!(0, types_1.isNumber)(convertedValue)) {
    // failed to cast
    return false;
  }
  if (rules.integer === false || rules.integer === exports.INTEGER.NO) {
    return convertedValue;
  }
  // already integer
  if ((0, types_1.isInteger)(convertedValue)) {
    return convertedValue;
  }
  if (rules.integer === true || rules.integer === exports.INTEGER.YES) {
    // not an integer and no round-off
    return false;
  }
  return round(convertedValue, rules.integer);
}
/**
 * round a value
 * @param value value to round
 * @param method round method
 * @returns rounded value
 */
function round(value, method) {
  if (value >= 0) {
    switch (method) {
      case exports.INTEGER.FLOOR:
      case exports.INTEGER.FLOOR_RZ:
        return Math.floor(value);
      case exports.INTEGER.CEIL:
      case exports.INTEGER.CEIL_RI:
        return Math.ceil(value);
      case exports.INTEGER.HALF_UP:
      case exports.INTEGER.HALF_UP_RZ:
        return Math.floor(value + 0.5);
      case exports.INTEGER.HALF_DOWN:
      case exports.INTEGER.HALF_DOWN_RZ:
        return Math.ceil(value - 0.5);
    }
  } else {
    switch (method) {
      case exports.INTEGER.FLOOR:
      case exports.INTEGER.CEIL_RI:
        return Math.floor(value);
      case exports.INTEGER.FLOOR_RZ:
      case exports.INTEGER.CEIL:
        return Math.ceil(value);
      case exports.INTEGER.HALF_UP:
      case exports.INTEGER.HALF_DOWN_RZ:
        return Math.floor(value + 0.5);
      case exports.INTEGER.HALF_UP_RZ:
      case exports.INTEGER.HALF_DOWN:
        return Math.ceil(value - 0.5);
    }
  }
  return false;
}