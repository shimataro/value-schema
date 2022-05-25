#!/bin/bash
# requires following packages:
# - git; I believe you have already installed.
# - sed; GNU sed is preferred. POSIX sed may not work.
set -eu

PACKAGE_NAME="value-schema"
URL_PRODUCT="https://github.com/shimataro/${PACKAGE_NAME}"
URL_REPOSITORY="${URL_PRODUCT}.git"
URL_COMPARE="${URL_PRODUCT}/compare"
URL_RELEASE="${URL_PRODUCT}/releases/new"
UPSTREAM="origin"

COLOR_ERROR="\e[1;41m"
COLOR_SECTION="\e[1;34m"
COLOR_COMMAND_NAME="\e[1;34m"
COLOR_OPTION="\e[4;36m"
COLOR_COMMAND="\e[4m"
COLOR_FILE="\e[1;34m"
COLOR_BRANCH="\e[1;31m"
COLOR_INPUT="\e[1;31m"
COLOR_SELECT="\e[1;32m"
COLOR_RESET="\e[m"

function main() {
	cd $(dirname ${0})/..

	if [ $# -lt 1 ]; then
		usage
	fi

	local VERSION=$1
	local TAG="v${VERSION}"
	local BRANCH="release/v${VERSION}"
	local BASE_BRANCH="${TAG%%.*}"

	check_version_format ${VERSION}
	check_current_branch ${BASE_BRANCH}

	create_branch ${BRANCH} ${BASE_BRANCH}
	update_package_version ${VERSION}
	update_changelog ${VERSION}
	verify_package
	commit_changes ${VERSION}
	finish ${VERSION} ${BRANCH} ${BASE_BRANCH} ${TAG}
}

function usage() {
	local COMMAND=`basename ${0}`

	echo -e "${COLOR_SECTION}NAME${COLOR_RESET}
	${COMMAND} - Prepare for new release

${COLOR_SECTION}SYNOPSIS${COLOR_RESET}
	${COLOR_COMMAND_NAME}${COMMAND}${COLOR_RESET} <${COLOR_OPTION}new-version${COLOR_RESET}>

${COLOR_SECTION}DESCRIPTION${COLOR_RESET}
	This command will...
	- create a new branch for release
	- update ${COLOR_FILE}CHANGELOG.md${COLOR_RESET}
	- update package version in ${COLOR_FILE}package.json${COLOR_RESET}
	- update dependencies version in ${COLOR_FILE}package.json${COLOR_RESET}
	- verify
	- ...and commit!

	${COLOR_OPTION}new-version${COLOR_RESET} must follow \"Semantic Versioning\" <https://semver.org/>.
"
	exit 1
}

function check_version_format() {
	if [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
		return
	fi

	echo -e "${COLOR_ERROR}ERROR:${COLOR_RESET} Follow \"Semantic Versioning\" <https://semver.org/> for new version.
" >&2
	exit 2
}

function check_current_branch() {
	local BASE_BRANCH=$1
	local CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
	if [ ${CURRENT_BRANCH} = ${BASE_BRANCH} ]; then
		return
	fi

	echo -e "${COLOR_ERROR}ERROR:${COLOR_RESET} Work on ${COLOR_BRANCH}${BASE_BRANCH}${COLOR_RESET} branch
	${COLOR_COMMAND}git checkout ${BASE_BRANCH}${COLOR_RESET}
" >&2
	exit 2
}

function create_branch() {
	local BRANCH=$1
	local BASE_BRANCH=$2

	git checkout -b ${BRANCH} ${BASE_BRANCH}
}

function update_package_version() {
	local VERSION=$1

	npm version --no-git-tag-version ${VERSION}
}

function update_changelog() {
	local VERSION=$1
	local DATE=`date "+%Y-%m-%d"`
	local KEYWORD="Unreleased"

	sed -i".bak" -r \
		-e "s/^((##\s+)\[${KEYWORD}\])$/\1\n\n\2[${VERSION}] - ${DATE}/" \
		-e "s/^(\[${KEYWORD}\](.*))(v.*)\.\.\.HEAD$/\1v${VERSION}...HEAD\n[${VERSION}]\2\3...v${VERSION}/" \
		CHANGELOG.md
}

function verify_package() {
	npm run verify
}

function commit_changes() {
	local VERSION=$1

	git add CHANGELOG.md package.json npm-shrinkwrap.json
	git commit -m "version ${VERSION}"
}

function finish() {
	local VERSION=$1
	local BRANCH=$2
	local BASE_BRANCH=$3
	local TAG=$4

	echo -e "
Branch ${COLOR_BRANCH}${BRANCH}${COLOR_RESET} has been created.
Remaining processes are...

1. Make sure all changes are correct
	${COLOR_COMMAND}git diff ${BASE_BRANCH} ${BRANCH}${COLOR_RESET}
2. Push to remote ${UPSTREAM}
	${COLOR_COMMAND}git push --set-upstream ${UPSTREAM} ${BRANCH}${COLOR_RESET}
3. Create a pull-request: ${COLOR_BRANCH}${BRANCH}${COLOR_RESET} to ${COLOR_BRANCH}${BASE_BRANCH}${COLOR_RESET}
	${URL_COMPARE}/${BASE_BRANCH}...${BRANCH}?expand=1&title=version%20${VERSION}
	select ${COLOR_SELECT}Squash and merge${COLOR_RESET}
4. Create a new release
	${URL_RELEASE}?tag=${TAG}&target=${BASE_BRANCH}&title=${PACKAGE_NAME}%20${VERSION}%20released
	Tag version: ${COLOR_INPUT}${TAG}${COLOR_RESET}
	Target: ${COLOR_INPUT}${BASE_BRANCH}${COLOR_RESET}
	Release title: ${COLOR_INPUT}${PACKAGE_NAME} ${VERSION} released${COLOR_RESET}
	Description this release: (copy and paste CHANGELOG.md)
5. Post processing
	${COLOR_COMMAND}git checkout ${BASE_BRANCH}${COLOR_RESET}
	${COLOR_COMMAND}git pull${COLOR_RESET}
	${COLOR_COMMAND}git fetch -p${COLOR_RESET}
	${COLOR_COMMAND}git branch -D ${BRANCH}${COLOR_RESET}

That's all!
"
}

main "$@"
