export default adjust;

import adjustObject from "./adjustObject";
import AdjusterBase from "./AdjusterBase";

/**
 * adjust multiple variables (as object)
 * @param {adjuster._.types.Input} data data to be adjusted
 * @param {adjuster._.types.Constraints} constraints adjuster objects
 * @param {adjuster._.types.ErrorHandler} [onError] error handler
 * @returns {Object<string, *>} adjusted data
 */
function adjust(data, constraints, onError = AdjusterBase.onErrorDefault)
{
	return adjustObject(data, constraints, onError, []);
}
