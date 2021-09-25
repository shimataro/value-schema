import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import { BaseSchema } from "./BaseSchema.ts";
export type OptionsForEnumerate<E> = ifUndefined.Options<E> | ifEmptyString.Options<E> | ifNull.Options<E> | Required<only.Options<E>>;
export class EnumerateSchema<E = never, Tx = never> extends BaseSchema<E | Tx> {
    constructor(options: OptionsForEnumerate<E>) {
        super(options, [
            ifUndefined.applyTo,
            ifEmptyString.applyTo,
            ifNull.applyTo,
            only.applyTo,
        ]);
    }
}
