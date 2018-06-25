How to release
===

## Merge `develop` branch into `master`.

**DO NOT COMMIT YET!**

```bash
git checkout master
git merge --no-ff --no-commit develop
```

## Edit `CHANGELOG.md`.

* about new version
* link reference (new version and `Unreleased`)

## Edit `package.json`.
### Update version number following [semantic versioning](https://semver.org/).

```json
{
  "name": "adjuster",
  "description": "validate and adjust input values",
  "version": "X.Y.Z", // EDIT HERE!
  ...
```

### Update dependencies if needed.

```bash
npm run check-updates -- -u
```

## Re-generate `npm-shrinkwrap.json`.

```bash
rm -rf npm-shrinkwrap.json node_modules &&
npm install &&
rm -rf package-lock.json npm-shrinkwrap.json &&
npm shrinkwrap --dev
```

## Stage modified meta files.

```bash
git add package.json npm-shrinkwrap.json CHANGELOG.md
```

## Commit changes and push.

```bash
git commit -m "version X.Y.Z"
git tag "vX.Y.Z"
git push
git push --tags
```

## Create release [here](https://github.com/shimataro/node-adjuster/releases).

title

```
node-adjuster X.Y.Z released
```

body (use `CHANGELOG.md`)

```markdown
# Release Note
## Added
* ...

## Changed
* ...

## Deprecated
* ...

## Removed
* ...

## Fixed
* ...

## Security
* ...

## Others
* ...
```

## Publish!

```bash
npm publish --access=public
```

## Finally, merge `master` branch into `develop` [here](https://github.com/shimataro/node-adjuster/compare/master?expand=1).

Don't forget to choose `Create a merge commit`!

## That's all!
