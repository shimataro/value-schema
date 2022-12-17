/**
 * make input/output values pair
 * @param value input value
 * @returns pairs
 */
export function makeValues(value) {
  return {
    input: value,
    output: value
  };
}
/**
 * check whether given value is a scalar or not
 * @param value value to check
 * @returns Yes/No
 */
export function isScalar(value) {
  return value === null || typeof value !== "object";
}
/**
 * check whether given value is a boolean or not
 * @param value value to check
 * @returns Yes/No
 */
export function isBoolean(value) {
  return typeof value === "boolean";
}
/**
 * check whether given value is a number or not
 * @param value value to check
 * @returns Yes/No
 */
export function isNumber(value) {
  if (typeof value !== "number") {
    return false;
  }
  if (Number.isNaN(value)) {
    return false;
  }
  // true otherwise
  return true;
}
/**
 * check whether given value is an integer or not
 * @param value value to check
 * @returns Yes/No
 */
export function isInteger(value) {
  return Number.isSafeInteger(value);
}
/**
 * check whether given value is a string or not
 * @param value value to check
 * @returns Yes/No
 */
export function isString(value) {
  return typeof value === "string";
}
/**
 * check whether given value is a numeric string or not
 * @param value value to check
 * @returns Yes/No
 */
export function isNumericString(value) {
  const pattern = /^[+-]?(\d+(\.\d*)?|(\.\d+))$/;
  if (!isString(value)) {
    return false;
  }
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}
/**
 * check whether given value is an array or not
 * @param value value to check
 * @returns yes/no
 */
export function isArray(value) {
  return Array.isArray(value);
}
/**
 * check whether given value is an object or not
 * @param value value to check
 * @returns Yes/No
 */
export function isObject(value) {
  if (value === null) {
    return false;
  }
  if (isArray(value)) {
    return false;
  }
  return typeof value === "object";
}
/**
 * check whether given value is an instance of Date or not
 * @param value value to check
 * @returns Yes/No
 */
export function isDate(value) {
  return value instanceof Date;
}
/**
 * check whether given value is a valid Date or not
 * @param value value to check
 * @returns Yes/No
 */
export function isValidDate(value) {
  return !Number.isNaN(value.getTime());
}