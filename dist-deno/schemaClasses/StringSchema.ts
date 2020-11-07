import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import * as maxLength from "../appliers/string/maxLength.ts";
import * as minLength from "../appliers/string/minLength.ts";
import * as pattern from "../appliers/string/pattern.ts";
import * as trims from "../appliers/string/trims.ts";
import * as type from "../appliers/string/type.ts";
import { BaseSchema } from "./BaseSchema.ts";
export const STRING = {
    PATTERN: pattern.PATTERN
};
export type OptionsForString = converter.Options<string> | ifEmptyString.Options<string> | ifNull.Options<string> | ifUndefined.Options<string> | only.Options<string> | type.Options | trims.Options | minLength.Options | maxLength.Options | pattern.Options;
export class StringSchema<Tx = never> extends BaseSchema<string | Tx> {
    constructor(options: OptionsForString) {
        super(options, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            type.applyTo,
            trims.applyTo,
            only.applyTo,
            ifEmptyString.applyTo,
            minLength.applyTo,
            maxLength.applyTo,
            pattern.applyTo,
            converter.applyTo,
        ]);
    }
}
