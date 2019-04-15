import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Map from "../decorators/map";
import Type from "../decorators/string/type";
import MinLength from "../decorators/string/minLength";
import MaxLength from "../decorators/string/maxLength";
import FullWidthToHalf from "../decorators/numericString/fullWidthToHalf";
import JoinArray from "../decorators/numericString/joinArray";
import SeparatedBy from "../decorators/numericString/separatedBy";
import Pattern from "../decorators/numericString/pattern";
import Checksum from "../decorators/numericString/checksum";

/**
 * factory
 * @returns {NumericStringAdjuster} adjuster instance
 */
export default () =>
{
	return new NumericStringAdjuster();
};

/**
 * adjuster for numeric string
 */
@Map
@Checksum
@MaxLength
@MinLength
@Pattern
@SeparatedBy
@Type
@JoinArray
@FullWidthToHalf
@AcceptEmptyString
@AcceptNull
@Default
class NumericStringAdjuster extends AdjusterBase
{
}
