"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.date = exports.DATE = void 0;
var DateSchema_1 = require("../schemaClasses/DateSchema");
var DateSchema_2 = require("../schemaClasses/DateSchema");
Object.defineProperty(exports, "DATE", {
  enumerable: true,
  get: function () {
    return DateSchema_2.DATE;
  }
});
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
function date(rules) {
  if (rules === void 0) {
    rules = {};
  }
  return new DateSchema_1.DateSchema(rules);
}
exports.date = date;