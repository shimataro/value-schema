import { Key, Values, isNumber, isNumericString } from "../../libs/types.ts";
const PRECISION = {
    MILLISECONDS: 0,
    SECONDS: 1,
    MINUTES: 2
} as const;
type PRECISION = typeof PRECISION[keyof typeof PRECISION];
export const UNIXTIME = {
    PRECISION: PRECISION
} as const;
type UNIXTIME = typeof UNIXTIME[keyof typeof UNIXTIME];
interface Unixtime {
    strictType?: boolean;
    precision: PRECISION;
}
type NormalizedUnixtime = Required<Unixtime>;
export interface Rules {
    unixtime?: false | Unixtime;
}
type NormalizedRules = Required<Rules>;
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    const normalizedRules: NormalizedRules = {
        unixtime: false,
        ...rules
    };
    // skip if "unixtime-mode" is disabled
    if (normalizedRules.unixtime === false) {
        return false;
    }
    const normalizedUnixtime: NormalizedUnixtime = {
        strictType: false,
        ...normalizedRules.unixtime
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
