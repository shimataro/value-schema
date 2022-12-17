import { makeValues } from "../libs/types.mjs";
/**
 * Base Schema Class
 */
export class BaseSchema {
  /**
   * constructor
   * @param rules rules
   * @param applyToList list of applyTo
   */
  constructor(rules, applyToList) {
    this.rules = rules;
    this.applyToList = applyToList;
  }
  /**
   * apply schema
   * @param value value to apply
   * @param onError error handler
   * @returns escapes from applyTo chain or not
   */
  applyTo(value, onError = onErrorDefault) {
    return this._applyTo(value, onError, []);
  }
  _applyTo(value, onError, keyStack) {
    try {
      const values = makeValues(value);
      for (const applyTo of this.applyToList) {
        if (applyTo(values, this.rules, keyStack)) {
          return values.output;
        }
      }
      return values.output;
    } catch (err) {
      return onError(err);
    }
  }
}
/**
 * default error handler
 * @param err error object
 */
export function onErrorDefault(err) {
  throw err;
}
/**
 * default finish handler
 */
export function onFinishDefault() {
  // do nothing
}