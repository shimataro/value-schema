import { Key, Values } from "../../libs/types";
declare const PRECISION: {
    readonly MILLISECONDS: 0;
    readonly SECONDS: 1;
    readonly MINUTES: 2;
};
type PRECISION = typeof PRECISION[keyof typeof PRECISION];
export declare const UNIXTIME: {
    /** precision of unixtime */
    readonly PRECISION: {
        readonly MILLISECONDS: 0;
        readonly SECONDS: 1;
        readonly MINUTES: 2;
    };
};
interface Unixtime {
    /** only accept number type */
    strictType?: boolean;
    /** precision of unixtime */
    precision: PRECISION;
}
export interface Rules {
    /** unixtime-mode; if omitted, unixtime will not be accepted */
    unixtime?: Unixtime;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<Date>;
export {};
