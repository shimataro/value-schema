import * as converter from "../appliers/converter.ts";
import * as ifEmptyString from "../appliers/ifEmptyString.ts";
import * as ifNull from "../appliers/ifNull.ts";
import * as ifUndefined from "../appliers/ifUndefined.ts";
import * as only from "../appliers/only.ts";
import * as checksum from "../appliers/numericString/checksum.ts";
import * as fullWidthToHalf from "../appliers/numericString/fullWidthToHalf.ts";
import * as joinsArray from "../appliers/numericString/joinsArray.ts";
import * as pattern from "../appliers/numericString/pattern.ts";
import * as separatedBy from "../appliers/numericString/separatedBy.ts";
import * as maxLength from "../appliers/string/maxLength.ts";
import * as minLength from "../appliers/string/minLength.ts";
import * as type from "../appliers/string/type.ts";
import { BaseSchema } from "../schemaClasses/BaseSchema.ts";
export { NullableOptions } from "../schemaClasses/BaseSchema.ts";
export const NUMERIC_STRING = {
    CHECKSUM_ALGORITHM: checksum.CHECKSUM_ALGORITHM
};
export type OptionsForNumericString = converter.Options<string> | ifEmptyString.Options<string> | ifNull.Options<string> | ifUndefined.Options<string> | only.Options<string> | checksum.Options | fullWidthToHalf.Options | joinsArray.Options | pattern.Options | separatedBy.Options | type.Options | minLength.Options | maxLength.Options;
export class NumericStringSchema<Tx = never> extends BaseSchema<string | Tx> {
    constructor(options: OptionsForNumericString) {
        super(options, [
            ifUndefined.applyTo,
            ifNull.applyTo,
            ifEmptyString.applyTo,
            fullWidthToHalf.applyTo,
            joinsArray.applyTo,
            type.applyTo,
            separatedBy.applyTo,
            pattern.applyTo,
            minLength.applyTo,
            maxLength.applyTo,
            checksum.applyTo,
            converter.applyTo,
        ]);
    }
}
