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
exports.NumberSchema = exports.NUMBER = void 0;
var ifEmptyString = require("../appliers/ifEmptyString");
var ifNull = require("../appliers/ifNull");
var ifUndefined = require("../appliers/ifUndefined");
var only = require("../appliers/only");
var transform = require("../appliers/transform");
var acceptsFullWidth = require("../appliers/number/acceptsFullWidth");
var maxValue = require("../appliers/number/maxValue");
var minValue = require("../appliers/number/minValue");
var type = require("../appliers/number/type");
var BaseSchema_1 = require("./BaseSchema");
exports.NUMBER = {
  INTEGER: type.INTEGER
};
var NumberSchema = /** @class */function (_super) {
  __extends(NumberSchema, _super);
  function NumberSchema(rules) {
    return _super.call(this, rules, [ifUndefined.applyTo, ifEmptyString.applyTo, ifNull.applyTo, acceptsFullWidth.applyTo, type.applyTo, only.applyTo, minValue.applyTo, maxValue.applyTo, transform.applyTo]) || this;
  }
  return NumberSchema;
}(BaseSchema_1.BaseSchema);
exports.NumberSchema = NumberSchema;