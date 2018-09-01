import {DEC_OCTET} from "./rfc";

const IPV4ADDRESS = `${DEC_OCTET}(\\.${DEC_OCTET}){3}`;

const PATTERN = IPV4ADDRESS;
const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN, REGEXP};
