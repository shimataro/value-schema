import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Only from "../decorators/only";
import Map from "../decorators/map";
import Type from "../decorators/string/type";
import Trim from "../decorators/string/trim";
import MinLength from "../decorators/string/minLength";
import MaxLength from "../decorators/string/maxLength";
import Pattern from "../decorators/string/pattern";

/**
 * factory
 * @returns {StringAdjuster} adjuster instance
 */
export default () =>
{
	return new StringAdjuster();
};

/**
 * adjuster for string
 */
@Map
@Pattern
@MaxLength
@MinLength
@AcceptEmptyString
@Only
@Trim
@Type
@AcceptNull
@Default
class StringAdjuster extends AdjusterBase
{
}
