import BaseSchema from "./../libs/BaseSchema";

import Default from "./../decorators/default";
import AcceptNull from "./../decorators/acceptNull";
import AcceptEmptyString from "./../decorators/acceptEmptyString";
import Type from "./../decorators/object/type";
import Schema from "./../decorators/object/schema";

/**
 * factory
 * @returns {ObjectSchema} schema instance
 */
export default () =>
{
	return new ObjectSchema();
};

/**
 * for object
 */
@Schema
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ObjectSchema extends BaseSchema
{
}
