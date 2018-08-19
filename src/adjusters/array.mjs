import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/array/type";
import MinLength from "../decorators/array/minLength";
import MaxLength from "../decorators/array/maxLength";
import Each from "../decorators/array/each";

/**
 * factory
 * @returns {ArrayAdjuster} adjuster instance
 */
export default () =>
{
	return new ArrayAdjuster();
};

/**
 * adjuster for array
 */
@MaxLength
@MinLength
@Each
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ArrayAdjuster extends AdjusterBase
{
}
