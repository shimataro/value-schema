export default adjust;

import adjustObject from "./adjustObject";
import AdjusterBase from "./AdjusterBase";

/**
 * adjust multiple variables (as object)
 * @param {Object<string, *>} data data to be adjusted
 * @param {Object<string, AdjusterBase>} constraints adjuster objects
 * @param {AdjusterBase.OnError} [onError] error handler
 * @returns {Object<string, *>} adjusted data
 */
function adjust(data, constraints, onError = AdjusterBase.onErrorDefault)
{
	return adjustObject(data, constraints, onError, []);
}
