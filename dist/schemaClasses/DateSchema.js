"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateSchema = exports.DATE = void 0;
var ifEmptyString = require("../appliers/ifEmptyString");
var ifNull = require("../appliers/ifNull");
var ifUndefined = require("../appliers/ifUndefined");
var transform = require("../appliers/transform");
var iso8601 = require("../appliers/date/iso8601");
var maxValue = require("../appliers/date/maxValue");
var minValue = require("../appliers/date/minValue");
var type = require("../appliers/date/type");
var unixtime = require("../appliers/date/unixtime");
var BaseSchema_1 = require("./BaseSchema");
exports.DATE = {
  UNIXTIME: unixtime.UNIXTIME
};
var DateSchema = /** @class */function (_super) {
  __extends(DateSchema, _super);
  function DateSchema(rules) {
    return _super.call(this, rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, unixtime.applyTo, iso8601.applyTo, maxValue.applyTo, minValue.applyTo, type.applyTo, transform.applyTo]) || this;
  }
  return DateSchema;
}(BaseSchema_1.BaseSchema);
exports.DateSchema = DateSchema;