"use strict";
const fs = require("fs");
const path = require("path");

modifyPackageJson();
removeModuleFiles();

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
 * remove module files
 */
function removeModuleFiles()
{
	const moduleFiles = ["npm-shrinkwrap.json", "package-lock.json", "node_modules"];
	for(const moduleFile of moduleFiles)
	{
		const fileName = path.resolve(__dirname, "..", moduleFile);
		fs.rmSync(fileName, {
			recursive: true,
			force: true,
		});
	}
}
