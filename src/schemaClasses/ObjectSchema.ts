import * as converter from "../appliers/converter";
import * as ifUndefined from "../appliers/ifUndefined";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";

import {AnyObject, ObjectTypeOf, SchemaObject} from "../libs/types";

import {BaseSchema} from "./BaseSchema";

export type RulesForObject<S> =
	converter.Rules<AnyObject> &
	ifUndefined.Rules<AnyObject> &
	ifEmptyString.Rules<AnyObject> &
	ifNull.Rules<AnyObject> &
	schema.Rules<S> &
	type.Rules;

export class ObjectSchema<S extends SchemaObject, Tx = never> extends BaseSchema<ObjectTypeOf<S> | Tx>
{
	constructor(rules: RulesForObject<S>)
	{
		super(rules, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			schema.applyTo,
			type.applyTo,
			converter.applyTo,
		]);
	}
}
