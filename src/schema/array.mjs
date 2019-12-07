import BaseSchema from "../libs/BaseSchema";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/array/type";
import MinLength from "../decorators/array/minLength";
import MaxLength from "../decorators/array/maxLength";
import Each from "../decorators/array/each";

/**
 * factory
 * @returns {ArraySchema} schema instance
 */
export default () =>
{
	return new ArraySchema();
};

/**
 * for array
 */
@MaxLength
@MinLength
@Each
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ArraySchema extends BaseSchema
{
}
