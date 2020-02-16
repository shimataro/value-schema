/* eslint-disable no-sync */
import * as fs from "fs";

const fileName = "./dist/index.js";

const stat = fs.statSync(fileName);
const input = fs.readFileSync(fileName, {
	encoding: "utf8",
});

// for interoperability of "pure CommonJS" and Babel / TypeScript
// IN: exports.default = e;
// OUT: module.exports = e; module.exports.default = e;
const output = input.replace(
	/^\s*exports\.default\s*=\s*(\w+)\s*;\s*$/m,
	"module.exports = $1; module.exports.default = $1;"
);

fs.writeFileSync(fileName, output, {
	mode: stat.mode,
});
