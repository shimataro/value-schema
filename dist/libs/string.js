"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHalfWidthAll = exports.toHalfWidth = void 0;
/**
 * convert full-width to half-width in str
 * @param str string to convert
 * @param charsets character sets to convert
 * @returns half-width string
 */
function toHalfWidth(str, charsets) {
  return str.replace(charsets, function (substr) {
    return toHalfWidthAll(substr);
  });
}
exports.toHalfWidth = toHalfWidth;
/**
 * convert full-width to half-width
 * @param str string to convert; ALL ELEMENTS MUST BE FULL-WIDTH!
 * @returns half-width string
 */
function toHalfWidthAll(str) {
  var charCodes = [];
  for (var index = 0; index < str.length; index++) {
    charCodes.push(str.charCodeAt(index) - 0xfee0);
  }
  return String.fromCharCode.apply(String, charCodes);
}
exports.toHalfWidthAll = toHalfWidthAll;