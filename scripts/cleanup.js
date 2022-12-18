"use strict";
const fs = require("fs");
const path = require("path");

modifyPackageJson();
removeExtraFiles();

/**
 * remove dev elements from "package.json"
 */
function modifyPackageJson()
{
	const fileName = path.resolve(__dirname, "..", "package.json");
	const encoding = "utf8";

	const str = fs.readFileSync(fileName, {
		encoding: encoding,
		flag: "r",
	});

	const data = JSON.parse(str);
	delete data.scripts;
	delete data.devDependencies;

	fs.writeFileSync(fileName, JSON.stringify(data, null, 2), {
		encoding: encoding,
		mode: 0o644,
	});
}

/**
 * remove extra files
 */
function removeExtraFiles()
{
	const lockfiles = ["npm-shrinkwrap.json", "package-lock.json", "node_modules"];
	for(const lockfile of lockfiles)
	{
		const fileName = path.resolve(__dirname, "..", lockfile);
		fs.rmSync(fileName, {
			recursive: true,
			force: true,
		});
	}
}
