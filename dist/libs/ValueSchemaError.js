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
var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueSchemaError = exports.RULE = void 0;
exports.RULE = {
  TYPE: "type",
  UNDEFINED: "undefined",
  NULL: "null",
  EMPTY_STRING: "empty-string",
  ONLY: "only",
  TRANSFORM: "transform",
  MIN_VALUE: "min-value",
  MAX_VALUE: "max-value",
  MIN_LENGTH: "min-length",
  MAX_LENGTH: "max-length",
  PATTERN: "pattern",
  CHECKSUM: "checksum"
};
/**
 * Value-Schema Error
 */
var ValueSchemaError = /** @class */function (_super) {
  __extends(ValueSchemaError, _super);
  /**
   * constructor
   * @param rule the rule that input value didn't satisfy
   * @param value input value
   * @param keyStack path to key that caused error
   */
  function ValueSchemaError(rule, value, keyStack) {
    var _this = _super.call(this, "".concat(rule, "; ").concat(value, "; ").concat(keyStack)) || this;
    _this.name = "ValueSchemaError";
    _this.rule = rule;
    _this.value = value;
    _this.keyStack = __spreadArray([], keyStack, true);
    return _this;
  }
  /**
   * throw an error
   * @param rule the rule that input value didn't satisfy
   * @param values input/output values
   * @param keyStack path to key that caused error
   * @throws error object
   */
  ValueSchemaError.raise = function (rule, values, keyStack) {
    throw new ValueSchemaError(rule, values.input, keyStack);
  };
  /**
   * check whether error is instance of ValueSchemaError or not
   * @param err error to check
   * @returns Yes/No
   */
  ValueSchemaError.is = function (err) {
    return err instanceof ValueSchemaError;
  };
  return ValueSchemaError;
}(Error);
exports.ValueSchemaError = ValueSchemaError;