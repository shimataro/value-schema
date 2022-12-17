"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidDate = exports.isDate = exports.isObject = exports.isArray = exports.isNumericString = exports.isString = exports.isInteger = exports.isNumber = exports.isBoolean = exports.isScalar = exports.makeValues = void 0;
/**
 * make input/output values pair
 * @param value input value
 * @returns pairs
 */
function makeValues(value) {
  return {
    input: value,
    output: value
  };
}
exports.makeValues = makeValues;
/**
 * check whether given value is a scalar or not
 * @param value value to check
 * @returns Yes/No
 */
function isScalar(value) {
  return value === null || typeof value !== "object";
}
exports.isScalar = isScalar;
/**
 * check whether given value is a boolean or not
 * @param value value to check
 * @returns Yes/No
 */
function isBoolean(value) {
  return typeof value === "boolean";
}
exports.isBoolean = isBoolean;
/**
 * check whether given value is a number or not
 * @param value value to check
 * @returns Yes/No
 */
function isNumber(value) {
  if (typeof value !== "number") {
    return false;
  }
  if (Number.isNaN(value)) {
    return false;
  }
  // true otherwise
  return true;
}
exports.isNumber = isNumber;
/**
 * check whether given value is an integer or not
 * @param value value to check
 * @returns Yes/No
 */
function isInteger(value) {
  return Number.isSafeInteger(value);
}
exports.isInteger = isInteger;
/**
 * check whether given value is a string or not
 * @param value value to check
 * @returns Yes/No
 */
function isString(value) {
  return typeof value === "string";
}
exports.isString = isString;
/**
 * check whether given value is a numeric string or not
 * @param value value to check
 * @returns Yes/No
 */
function isNumericString(value) {
  var pattern = /^[+-]?(\d+(\.\d*)?|(\.\d+))$/;
  if (!isString(value)) {
    return false;
  }
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}
exports.isNumericString = isNumericString;
/**
 * check whether given value is an array or not
 * @param value value to check
 * @returns yes/no
 */
function isArray(value) {
  return Array.isArray(value);
}
exports.isArray = isArray;
/**
 * check whether given value is an object or not
 * @param value value to check
 * @returns Yes/No
 */
function isObject(value) {
  if (value === null) {
    return false;
  }
  if (isArray(value)) {
    return false;
  }
  return typeof value === "object";
}
exports.isObject = isObject;
/**
 * check whether given value is an instance of Date or not
 * @param value value to check
 * @returns Yes/No
 */
function isDate(value) {
  return value instanceof Date;
}
exports.isDate = isDate;
/**
 * check whether given value is a valid Date or not
 * @param value value to check
 * @returns Yes/No
 */
function isValidDate(value) {
  return !Number.isNaN(value.getTime());
}
exports.isValidDate = isValidDate;