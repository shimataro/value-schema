import { Key, Values } from "../../libs/types";
export declare const INTEGER: {
    /** does not care */
    readonly NO: 0;
    /** must be integer; causes error if otherwise */
    readonly YES: 1;
    /** rounds down (towards minus infinity) */
    readonly FLOOR: 2;
    /** rounds towards 0 (away from infinity) */
    readonly FLOOR_RZ: 3;
    /** rounds up (towards plus infinity) */
    readonly CEIL: 4;
    /** rounds away from 0 (towards infinity) */
    readonly CEIL_RI: 5;
    /** rounds half up (towards positive infinity) */
    readonly HALF_UP: 6;
    /** rounds half towards zero (away from infinity) */
    readonly HALF_UP_RZ: 7;
    /** rounds half down (towards negative infinity) */
    readonly HALF_DOWN: 8;
    /** rounds half away from zero (towards infinity) */
    readonly HALF_DOWN_RZ: 9;
};
type INTEGER = typeof INTEGER[keyof typeof INTEGER];
type IntegerLike = boolean | INTEGER;
export interface Rules {
    /** does not convert type; causes error if type does not match */
    strictType?: boolean;
    /** accepts string with special format; e.g., "1e+2", "0x100" */
    acceptsSpecialFormats?: boolean;
    /** needs integer */
    integer?: IntegerLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<number>;
export {};
