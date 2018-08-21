const PATTERN_COMPONENT = `(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})`;
const PATTERN = `${PATTERN_COMPONENT}(\\.${PATTERN_COMPONENT}){3}`;

const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN, REGEXP};
