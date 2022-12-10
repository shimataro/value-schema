import { Key, Values, isNumber, isNumericString } from "../../libs/types.ts";
const PRECISION = {
    MILLISECONDS: 0,
    SECONDS: 1,
    MINUTES: 2
} as const;
type PRECISION = typeof PRECISION[keyof typeof PRECISION];
export const UNIXTIME = {
    /** precision of unixtime */
    PRECISION: PRECISION
} as const;
type UNIXTIME = typeof UNIXTIME[keyof typeof UNIXTIME];
interface Unixtime {
    /** only accept number type */
    strictType?: boolean;
    /** precision of unixtime */
    precision: PRECISION;
}
type NormalizedUnixtime = Required<Unixtime>;
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
export function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<Date> {
    // skip if "unixtime-mode" is disabled
    if (rules.unixtime === undefined) {
        return false;
    }
    const normalizedUnixtime: NormalizedUnixtime = {
        strictType: false,
        ...rules.unixtime
    };
    if (!normalizedUnixtime.strictType && isNumericString(values.output)) {
        // convert to number
        values.output = Number(values.output);
    }
    if (!isNumber(values.output)) {
        return false;
    }
    if (Number.isInteger(values.output) && !Number.isSafeInteger(values.output)) {
        // integer but not safe
        return false;
    }
    switch (normalizedUnixtime.precision) {
        case UNIXTIME.PRECISION.MILLISECONDS:
            values.output = new Date(values.output);
            return false;
        case UNIXTIME.PRECISION.SECONDS:
            values.output = new Date(values.output * 1000);
            return false;
        case UNIXTIME.PRECISION.MINUTES:
            values.output = new Date(values.output * 1000 * 60);
            return false;
    }
    return false;
}
