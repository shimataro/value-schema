import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Convert from "../decorators/convert";
import Type from "../decorators/string/type";
import MinLength from "../decorators/string/minLength";
import MaxLength from "../decorators/string/maxLength";
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
@Convert
@Checksum
@MaxLength
@MinLength
@Pattern
@SeparatedBy
@Type
@JoinArray
@AcceptEmptyString
@AcceptNull
@Default
class NumericStringAdjuster extends AdjusterBase
{
}
