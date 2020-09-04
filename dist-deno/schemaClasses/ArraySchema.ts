import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as each from "../appliers/array/each.ts";
import * as maxLength from "../appliers/array/maxLength.ts";
import * as minLength from "../appliers/array/minLength.ts";
import * as type from "../appliers/array/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export { NullableOptions } from "./BaseSchema.ts";
export type OptionsForArray<T> = converter.Options<T[]> | ifUndefined.Options<T[]> | ifEmptyString.Options<T[]> | ifNull.Options<T[]> | each.Options<T> | minLength.Options | maxLength.Options | type.Options;
export class ArraySchema<T, Tx = never> extends BaseSchema<T[] | Tx> {
    constructor(options: OptionsForArray<T>) {
        super(options, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            type.applyTo,
            each.applyTo,
            minLength.applyTo,
            maxLength.applyTo,
            converter.applyTo,
        ]);
    }
}
