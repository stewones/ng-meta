# Change Log
All notable changes to this project will be documented in this file.

## v0.4.0-rc.1 - 2017-04-08
### Breaking change
- Set meta tags thru `MetaGuard` (closes [#35](https://github.com/nglibs/meta/issue/35))

### Added
- Added prevent direct DOM manipulation (closes [#31](https://github.com/nglibs/meta/issue/31))

### Fixed
- Resolved updateLocales method does not clear `og:locale:alternate` tags (closes [#33](https://github.com/nglibs/meta/issue/33))
- Resolved observable combining (closes [#36](https://github.com/nglibs/meta/issue/36))
- Resolved support Promises at the `callback` function (closes [#25](https://github.com/nglibs/meta/issue/25))

### Changed
- Removed `[].slice.call(elements)` (closes [#34](https://github.com/nglibs/meta/issue/34))
- Removed manual & deferred initialization (closes [#37](https://github.com/nglibs/meta/issue/37))
- Updated README.md
- Updated deps, gulp tasks
- Depend on Angular 4.0.0
- Some refactoring

## v0.2.0-rc.4 - 2017-03-14
### Added
- Added callback function, to use a custom logic on the meta tag contents (http-get, translate, etc.) (closes [#7](https://github.com/nglibs/meta/issue/7))

### Fixed
- Resolved og:locale insists to remain default when @nglibs/i18n-router is used (closes [#18](https://github.com/nglibs/meta/issue/18))
- Resolved depend on Angular 2.0.0 (closes [#21](https://github.com/nglibs/meta/issues/21))
- Resolved new npm package @nglibs/meta no longer update title programmatically (closes [#22](https://github.com/nglibs/meta/issue/22), [#24](https://github.com/nglibs/meta/issue/24))
- Resolved setting og:locale tag without specifying default og:locale throws error (closes [#23](https://github.com/nglibs/meta/issues/23))

### Changed
- Updated deps
- Some refactoring

## v0.2.0-rc.3 - 2017-02-24
### Fixed
- Resolved no page title & meta tags set when route contains no `meta` (closes [#15](https://github.com/nglibs/meta/issue/15))
- Resolved no .js files after installing from npm's registry (closes [#16](https://github.com/nglibs/meta/issue/16))
- Resolved og:url doesn't get rendered correctly using redirectTo (closes [#17](https://github.com/nglibs/meta/issue/17))

## v0.2.0-rc.2 - 2017-02-23
### Breaking change
- `@nglibs/metadata` has been renamed to `@nglibs/meta`

### Fixed
- Forced to use TypeScript 2.1.x

### Changed
- Updated README.md

## v0.2.0-rc.1 - 2017-02-17
### Changed
- Some refactoring

## v0.2.0-beta.3 - 2017-02-11
### Changed
- Updated README.md
- Some refactoring

## v0.2.0-beta.2 - 2017-02-11
### Changed
- Updated README.md
- Moved tests in `tests` folder
- Some refactoring

## v0.2.0-beta.1 - 2017-02-09
### Fixed
- Fixed `tslib` dep

### Merged with @fulls1z3/ng2-metadata
- Merged with [fulls1z3/ng2-metadata](https://github.com/fulls1z3/ng2-metadata)
- Updated deps
- Stability fixes
