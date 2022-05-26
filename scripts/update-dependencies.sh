#!/bin/bash
# update dependencies
set -eu

DATE=$(date +"%Y%m%d")
BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TARGET_BRANCH=feature/update-dependencies-${DATE}
COLOR_SUCCESS="\e[1;32m"
COLOR_ERROR="\e[1;41m"
COLOR_RESET="\e[m"

cd $(dirname ${0})/..

# check NPM version
NPM_VERSION=$(npm -v)
NPM_VERSION_MAJOR=${NPM_VERSION%%.*}
if [[ ${NPM_VERSION_MAJOR} -ge 7 ]]; then
	# needs lockfileVersion=1
	echo -e "${COLOR_ERROR}Error:${COLOR_RESET} Failed to update dependencies. Please use NPM<7 (Node.js<=14); current version is ${NPM_VERSION}."
	exit 1
fi

# create target branch
if [[ ! ${BASE_BRANCH} =~ ^v[0-9]+$ ]]; then
	echo -e "${COLOR_ERROR}Error:${COLOR_RESET} Base branch must match 'v*'; got ${BASE_BRANCH}."
	exit 1
fi
git checkout -b ${TARGET_BRANCH}

# check updates
npm run check-updates -- -u

# re-install packages
rm -rf npm-shrinkwrap.json node_modules
npm i
npm dedupe

# test
npm run build
npm run verify

# commit
npm shrinkwrap
git add package.json npm-shrinkwrap.json
git commit -m "update dependencies"

# finished!
echo -e "
${COLOR_SUCCESS}🎉All dependencies are updated successfully.🎉${COLOR_RESET}

Push changes and merge into '${BASE_BRANCH}' branch.

    git push --set-upstream origin ${TARGET_BRANCH}
"
