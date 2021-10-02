import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth.ts";
import * as maxValue from "../appliers/number/maxValue.ts";
import * as minValue from "../appliers/number/minValue.ts";
import * as type from "../appliers/number/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export const NUMBER = {
    INTEGER: type.INTEGER
} as const;
export type OptionsForNumber = converter.Options<number> & ifUndefined.Options<number> & ifEmptyString.Options<number> & ifNull.Options<number> & only.Options<number> & acceptsFullWidth.Options & type.Options & minValue.Options & maxValue.Options;
export class NumberSchema<Tx = never> extends BaseSchema<number | Tx> {
    constructor(options: OptionsForNumber) {
        super(options, [
            ifUndefined.applyTo,
            ifEmptyString.applyTo,
            ifNull.applyTo,
            acceptsFullWidth.applyTo,
            type.applyTo,
            only.applyTo,
            minValue.applyTo,
            maxValue.applyTo,
            converter.applyTo,
        ]);
    }
}
