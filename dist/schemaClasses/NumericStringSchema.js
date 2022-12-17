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
exports.NumericStringSchema = exports.NUMERIC_STRING = void 0;
var ifEmptyString = require("../appliers/ifEmptyString");
var ifNull = require("../appliers/ifNull");
var ifUndefined = require("../appliers/ifUndefined");
var transform = require("../appliers/transform");
var checksum = require("../appliers/numericString/checksum");
var fullWidthToHalf = require("../appliers/numericString/fullWidthToHalf");
var joinsArray = require("../appliers/numericString/joinsArray");
var pattern = require("../appliers/numericString/pattern");
var separatedBy = require("../appliers/numericString/separatedBy");
var maxLength = require("../appliers/string/maxLength");
var minLength = require("../appliers/string/minLength");
var type = require("../appliers/string/type");
var BaseSchema_1 = require("../schemaClasses/BaseSchema");
exports.NUMERIC_STRING = {
  CHECKSUM_ALGORITHM: checksum.CHECKSUM_ALGORITHM
};
var NumericStringSchema = /** @class */function (_super) {
  __extends(NumericStringSchema, _super);
  function NumericStringSchema(rules) {
    return _super.call(this, rules, [ifUndefined.applyTo, ifNull.applyTo, ifEmptyString.applyTo, fullWidthToHalf.applyTo, joinsArray.applyTo, type.applyTo, separatedBy.applyTo, pattern.applyTo, minLength.applyTo, maxLength.applyTo, checksum.applyTo, transform.applyTo]) || this;
  }
  return NumericStringSchema;
}(BaseSchema_1.BaseSchema);
exports.NumericStringSchema = NumericStringSchema;