import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/object/type";
import Constraints from "../decorators/object/constraints";

/**
 * factory
 * @returns {ObjectAdjuster} adjuster instance
 */
export default () =>
{
	return new ObjectAdjuster();
};

/**
 * adjuster for object
 */
@Constraints
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ObjectAdjuster extends AdjusterBase
{
}
