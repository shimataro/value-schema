"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onFinishDefault = exports.onErrorDefault = exports.BaseSchema = void 0;
var types_1 = require("../libs/types");
/**
 * Base Schema Class
 */
var BaseSchema = /** @class */function () {
  /**
   * constructor
   * @param rules rules
   * @param applyToList list of applyTo
   */
  function BaseSchema(rules, applyToList) {
    this.rules = rules;
    this.applyToList = applyToList;
  }
  /**
   * apply schema
   * @param value value to apply
   * @param onError error handler
   * @returns escapes from applyTo chain or not
   */
  BaseSchema.prototype.applyTo = function (value, onError) {
    if (onError === void 0) {
      onError = onErrorDefault;
    }
    return this._applyTo(value, onError, []);
  };
  BaseSchema.prototype._applyTo = function (value, onError, keyStack) {
    try {
      var values = (0, types_1.makeValues)(value);
      for (var _i = 0, _a = this.applyToList; _i < _a.length; _i++) {
        var applyTo = _a[_i];
        if (applyTo(values, this.rules, keyStack)) {
          return values.output;
        }
      }
      return values.output;
    } catch (err) {
      return onError(err);
    }
  };
  return BaseSchema;
}();
exports.BaseSchema = BaseSchema;
/**
 * default error handler
 * @param err error object
 */
function onErrorDefault(err) {
  throw err;
}
exports.onErrorDefault = onErrorDefault;
/**
 * default finish handler
 */
function onFinishDefault() {
  // do nothing
}
exports.onFinishDefault = onFinishDefault;