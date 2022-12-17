"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enumeration = void 0;
var EnumerationSchema_1 = require("../schemaClasses/EnumerationSchema");
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function enumeration(rules) {
  return new EnumerationSchema_1.EnumerationSchema(rules);
}
exports.enumeration = enumeration;