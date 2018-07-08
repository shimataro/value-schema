How to release
===

## Create a branch `feature-vX.Y.Z` from `develop`.
Follow [semantic versioning](https://semver.org/).

```bash
git checkout develop
git checkout -b "feature-vX.Y.Z"
```

### Edit `package.json`.
#### Update version number.

```json
{
  "name": "adjuster",
  "description": "validate and adjust input values",
  "version": "X.Y.Z", // EDIT HERE!
  ...
```

#### Update dependencies if needed.

```bash
npm run check-updates -- -u
```

### Edit `CHANGELOG.md`.

* about new version
* link reference (new version and `Unreleased`)

### Re-generate `npm-shrinkwrap.json`.

```bash
rm -rf npm-shrinkwrap.json node_modules &&
npm install &&
npm shrinkwrap
```

### Commit changes and push.

```bash
git add package.json npm-shrinkwrap.json CHANGELOG.md
git commit -m "version X.Y.Z"
git push
```

## Create a pull-request.
### `feature-vX.Y.Z` to `develop`

Select **Squash and merge**.

### `develop` to `master`

Select **Create a merge commit**.

## Create release [here](https://github.com/shimataro/node-adjuster/releases).

* Tag version: `vX.Y.Z`
* Target: `master`
* Release title: `node-adjuster X.Y.Z released`
* Discribe this release (use `CHANGELOG.md`):
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

## That's all!
