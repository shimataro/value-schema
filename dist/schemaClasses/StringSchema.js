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
exports.StringSchema = exports.STRING = void 0;
var ifEmptyString = require("../appliers/ifEmptyString");
var ifNull = require("../appliers/ifNull");
var ifUndefined = require("../appliers/ifUndefined");
var only = require("../appliers/only");
var transform = require("../appliers/transform");
var maxLength = require("../appliers/string/maxLength");
var minLength = require("../appliers/string/minLength");
var pattern = require("../appliers/string/pattern");
var trims = require("../appliers/string/trims");
var type = require("../appliers/string/type");
var BaseSchema_1 = require("./BaseSchema");
exports.STRING = {
  PATTERN: pattern.PATTERN
};
var StringSchema = /** @class */function (_super) {
  __extends(StringSchema, _super);
  function StringSchema(rules) {
    return _super.call(this, rules, [ifUndefined.applyTo, ifNull.applyTo, type.applyTo, trims.applyTo, only.applyTo, ifEmptyString.applyTo, minLength.applyTo, maxLength.applyTo, pattern.applyTo, transform.applyTo]) || this;
  }
  return StringSchema;
}(BaseSchema_1.BaseSchema);
exports.StringSchema = StringSchema;