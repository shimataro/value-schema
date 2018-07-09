#!/bin/bash
# requires following packages:
# - git; I believe already installed.
# - sed; GNU sed is preferred. POSIX sed may not work.

BASE_BRANCH="develop"

URL_PRODUCT="https://github.com/shimataro/node-adjuster"
URL_RELEASE="${URL_PRODUCT}/releases"

function main() {
	cd `dirname ${0}`

	# check version number
	if [ $# -lt 1 ]; then
		echo -e "\033[1;41mERROR:\033[0;39m Specify package version" >&2
		return 2
	fi
	if [[ ! $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
		echo -e "\033[1;41mERROR:\033[0;39m Use \"Semantic Versioning\" for version: https://semver.org/" >&2
		return 2
	fi

	# check current branch
	local CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
	if [ ${CURRENT_BRANCH} != ${BASE_BRANCH} ]; then
		echo -e "\033[1;41mERROR:\033[0;39m Work on \033[1;31m${BASE_BRANCH}\033[0;39m branch" >&2
		echo -e "\tgit checkout ${BASE_BRANCH}" >&2
		return 2
	fi

	local VERSION=$1
	local BRANCH="feature-v${VERSION}"
	local TAG="v${VERSION}"

	create_branch ${BRANCH} &&
	update_changelog ${VERSION} &&
	update_package_version ${VERSION} &&
	update_dependencies_version &&
	regenerate_npm_shrinkwrap &&
	verify_package &&
	commit_changes ${VERSION} &&
	finish ${VERSION} ${BRANCH} ${TAG}
}

function create_branch() {
	local BRANCH=$1

	git checkout -b ${BRANCH} ${BASE_BRANCH}
}

function update_changelog() {
	local VERSION=$1
	local DATE=`date "+%Y-%m-%d"`

	sed -i".bak" -r \
		-e "s/^((##\s+)\[Unreleased\])$/\1\n\n\2[${VERSION}] - ${DATE}/" \
		-e "s/^(\[Unreleased\](.*))(v.*)\.\.\.HEAD$/\1v${VERSION}...HEAD\n[${VERSION}]\2\3...v${VERSION}/" \
		CHANGELOG.md
}

function update_package_version() {
	local VERSION=$1

	sed -i".bak" -r \
		-e "s/(\"version\"\s*:\s*)\".*?\"/\1\"${VERSION}\"/" \
		package.json
}

function update_dependencies_version() {
	npm run check-updates -- -u
}

function regenerate_npm_shrinkwrap() {
	rm -rf npm-shrinkwrap.json node_modules &&
	npm install && npm shrinkwrap
}

function verify_package() {
	npm test && npm run lint
}

function commit_changes() {
	local VERSION=$1

	git add CHANGELOG.md package.json npm-shrinkwrap.json &&
	git commit -m "version ${VERSION}"
}

function finish() {
	local VERSION=$1
	local BRANCH=$2
	local TAG=$3

	echo -e "Branch \033[1;31m${BRANCH}\033[0;39m has been created."
	echo -e "Reamining processes are..."
	echo -e ""
	echo -e "1. Make sure all changes are correct"
	echo -e "\tgit diff develop ${BRANCH}"
	echo -e "2. Push to remote origin"
	echo -e "\tgit push --set-upstream origin ${BRANCH}"
	echo -e "3. Visit ${URL_PRODUCT}"
	echo -e "4. Create a pull-request: \033[1;31m${BRANCH}\033[0;39m to \033[1;31mdevelop\033[0;39m"
	echo -e "\tselect \033[1;32mSquash and merge\033[0;39m"
	echo -e "5. Create a pull-request: \033[1;31mdevelop\033[0;39m to \033[1;31mmaster\033[0;39m"
	echo -e "\tselect \033[1;32mCreate a merge commit\033[0;39m"
	echo -e "6. Create release: ${URL_RELEASE}"
	echo -e "\tTag version: \033[1;31m${TAG}\033[0;39m"
	echo -e "\tTarget: \033[1;31mmaster\033[0;39m"
	echo -e "\tRelease title: \033[1;31mnode-adjuster ${VERSION} released\033[0;39m"
	echo -e "\tDescription this release: (see CHANGELOG.md)"
	echo -e "7. Publish!"
	echo -e "\tnpm publish --access=public"
	echo -e ""
	echo -e "That's all!"
}

main "$@"
