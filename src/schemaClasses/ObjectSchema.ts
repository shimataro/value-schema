import * as converter from "../appliers/converter";
import * as ifUndefined from "../appliers/ifUndefined";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";

import {AnyObject, ObjectTypeOf, SchemaObject} from "../libs/types";

import {BaseSchema} from "./BaseSchema";

export type OptionsForObject<S> =
	converter.Options<AnyObject> &
	ifUndefined.Options<AnyObject> &
	ifEmptyString.Options<AnyObject> &
	ifNull.Options<AnyObject> &
	schema.Options<S> &
	type.Options;

export class ObjectSchema<S extends SchemaObject, Tx = never> extends BaseSchema<ObjectTypeOf<S> | Tx>
{
	constructor(options: OptionsForObject<S>)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			schema.applyTo,
			type.applyTo,
			converter.applyTo,
		]);
	}
}
