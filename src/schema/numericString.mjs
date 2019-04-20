import BaseSchema from "../libs/BaseSchema";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Convert from "../decorators/convert";
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
 * @returns {NumericStringSchema} schema instance
 */
export default () =>
{
	return new NumericStringSchema();
};

/**
 * valueSchema for numeric string
 */
@Convert
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
class NumericStringSchema extends BaseSchema
{
}
