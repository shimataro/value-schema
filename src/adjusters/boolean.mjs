import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/boolean/type";

/**
 * factory
 * @returns {BooleanAdjuster} adjuster instance
 */
export default () =>
{
	return new BooleanAdjuster();
};

/**
 * adjuster for boolean
 */
@Type
@AcceptEmptyString
@AcceptNull
@Default
class BooleanAdjuster extends AdjusterBase
{
}
