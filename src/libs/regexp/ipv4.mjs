import {DEC_OCTET} from "./rfc";

const IPV4ADDRESS = `${DEC_OCTET}(\\.${DEC_OCTET}){3}`;

const PATTERN_IPV4 = IPV4ADDRESS;
const REGEXP_IPV4 = new RegExp(`^${PATTERN_IPV4}$`);

export {PATTERN_IPV4, REGEXP_IPV4};
