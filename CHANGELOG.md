# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
* `adjuster.boolean()`
* `adjuster.number().strict()`
* `adjuster.string().strict()`
* `adjuster.array()`
* `adjuster.object()`
* `err.keyStack` indicates path to key that caused error; for nested object or array

### Changed
* cause an error `adjuster.CAUSE.TYPE` instead of  `adjuster.CAUSE.NOT_OBJECT`
* reject array and object in `adjuster.string()`
* in `numericString`, when `.joinArray()` is not called and an array is passed, cause an error `adjuster.CAUSE.TYPE` instead of `adjuster.CAUSE.PATTERN`

### Deleted
* `adjuster.numberArray()` - use `adjuster.array()` instead
* `adjuster.stringArray()` - use `adjuster.array()` instead
* `err.key` - use `err.keyStack` instead

## [0.14.0] - 2018-08-11
### Added
* Introduction in `README.md`

### Changed
* cause an error `adjuster.CAUSE.NOT_OBJECT` when `input` type of `adjuster.adjust()` is not an object

### Fixed
* build error in Windows

### Others
* support ES Modules (`*.mjs`)

## [0.13.0] - 2018-07-20
### Added
* `adjuster.numberArray().eachInteger()`

### Fixed
* `adjuster.numberArray().eachIn()` in JSDoc (should be `adjuster.numberArray().eachOnly()`)
* `adjuster.stringArray().eachIn()` in JSDoc (should be `adjuster.stringArray().eachOnly()`)

## [0.12.0] - 2018-07-18
### Added
* `adjuster.STRING_PATTERN`, regular expressions for `adjuster.string().pattern()`
* `adjuster.number().integer()`

### Fixed
* `adjuster.number().adjust(true)` throws an error; should return `1`

## [0.11.0] - 2018-07-16
### Added
* `adjuster.number().acceptSpecialFormats()`
* `adjuster.numberArray().eachAcceptSpecialFormats()`

### Changed
* rename method; `allowEmptyString()` to `acceptEmptyString()`
* rename method; `allowNull()` to `acceptNull()`
* rename method; `eachAllowEmptyString()` to `eachAcceptEmptyString()`
* rename method; `eachAllowNull()` to `eachAcceptNull()`

## [0.10.1] - 2018-07-09
### Others
* follow `valid-jsdoc` option for ESLint
* follow `wrap-regex` option for ESLint

## [0.10.0] - 2018-06-23
### Changed
* `adjuster.number()` limits input value to `Number.MIN_SAFE_INTEGER` or more and `Number.MAX_SAFE_INTEGER` or less

### Others
* support Microsoft Windows officially

## [0.9.0] - 2018-06-16
### Added
* `adjuster.number().allowNull()`
* `adjuster.numberArray().allowNull()`
* `adjuster.numberArray().eachAllowNull()`
* `adjuster.string().allowNull()`
* `adjuster.stringArray().allowNull()`
* `adjuster.stringArray().eachAllowNull()`
* `adjuster.numericString().allowNull()`
* `adjuster.ipv4().allowNull()`
* `adjuster.ipv6().allowNull()`
* `adjuster.email().allowNull()`

### Changed
* 3rd parameter of `adjuster.adjust()`, `onError`, receives `null` argument after all adjustment has finished and errors has occurred
* remove 4th parameter of `adjuster.adjust()`, `onErrorAll`

### Fixed
* description about error handler in [README.md](README.md)

## [0.8.0] - 2018-06-03
### Added
* `adjuster.email().trim()`
* `adjuster.ipv4().trim()`
* `adjuster.ipv6().trim()`
* `adjuster.string().trim()`
* `adjuster.stringArray().eachTrim()`

### Changed
* `AdjusterError.prototype.key` indicates a key name that caused error; only filled in `adjuster.adjust()`, otherwise `null`
* error handler for `adjuster.adjust()` needs only 1 parameters `err`; `key` is in `err.key`
* rename `.in()` to `.only()`

### Others
* use changelog
* reference in README

## [0.7.0] - 2018-05-20
### Added
* `adjuster.numericString().joinArray()`

### Others
* support complement of [IntelliJ IDEA](https://www.jetbrains.com/idea/)

## [0.6.0] - 2018-05-17
### Added
* `adjuster.numericString()`

### Changed
* `allowEmpty()` => `allowEmptyString()`
* `adjuster.CAUSE.EMAIL` => `adjuster.CAUSE.PATTERN`
* `adjuster.CAUSE.IPV4` => `adjuster.CAUSE.PATTERN`
* `adjuster.CAUSE.IPV6` => `adjuster.CAUSE.PATTERN`

## [0.5.0] - 2018-05-12
### Added
* `adjuster.numberArray()`
* `adjuster.stringArray()`

### Changed
* rename `adjuster.adjustData()` to `adjuster.adjust()`
* throw first error when both `onError` and `onErrorAll` are null in `adjuster.adjust()`

### Others
* support [Visual Studio Code](https://code.visualstudio.com/) officially

## [0.4.0] - 2018-05-06
### Added
* `adjuster.ipv4()`
* `adjuster.ipv6()`

### Changed
* strict IPv4 and IPv6 validation for `adjuster.email()`

## [0.3.0] - 2018-04-22
### Changed
* limit the length of local/domain part of email

### Fixed
* quoted-pair of email
* import error in `EmailAdjuster.es`

## [0.2.0] - 2018-04-21
### Changed
* enable to specify value to `allowEmpty()`
* support IPv6 domain for `EmailAdjuster`

### Fixed
* test error on npm@5

## [0.1.0] - 2018-04-18
* First release.

[Unreleased]: https://github.com/shimataro/node-adjuster/compare/v0.14.0...HEAD
[0.14.0]: https://github.com/shimataro/node-adjuster/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/shimataro/node-adjuster/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/shimataro/node-adjuster/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/shimataro/node-adjuster/compare/v0.10.1...v0.11.0
[0.10.1]: https://github.com/shimataro/node-adjuster/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/shimataro/node-adjuster/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/shimataro/node-adjuster/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/shimataro/node-adjuster/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/shimataro/node-adjuster/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/shimataro/node-adjuster/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/shimataro/node-adjuster/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/shimataro/node-adjuster/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/shimataro/node-adjuster/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/shimataro/node-adjuster/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/shimataro/node-adjuster/compare/1423ec95c5f2fa39f8f7bccd117f09cfadb8db3e...v0.1.0
