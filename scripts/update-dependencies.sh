#!/bin/bash
# update dependencies

DATE=$(date +"%Y%m%d")
BRANCH=feature/update-dependencies-${DATE}
COLOR_SUCCESS="\e[1;32m"
COLOR_RESET="\e[m"

cd $(dirname ${0})/..

# create branch
git checkout develop || exit 1
git checkout -b ${BRANCH} || exit 1

# check updates
npm run check-updates -- -u || exit 1

# re-install packages
rm -rf npm-shrinkwrap.json node_modules || exit 1
npm i || exit 1

# test
npm run build || exit 1
npm run verify || exit 1

# commit
npm shrinkwrap || exit 1
git add package.json npm-shrinkwrap.json || exit 1
git commit -m "update dependencies" || exit 1

# finished!
echo -e "
${COLOR_SUCCESS}🎉All dependencies are updated successfully.🎉${COLOR_RESET}

Push changes and merge into 'develop' branch.

    git push --set-upstream origin ${BRANCH}
"
