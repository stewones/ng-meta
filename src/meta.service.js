import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import * as _ from 'lodash';
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetaLoader } from './meta.loader';
import { isPromise, isObservable } from './util';
import * as $ from 'jquery';

var MetaService = (function () {
    function MetaService(loader, title, meta) {
        this.loader = loader;
        this.title = title;
        this.meta = meta;
        this.metaSettings = loader.getSettings();
        this.isMetaTagSet = {};
    }
    MetaService.prototype.setTitle = function (title, override) {
        var _this = this;
        if (override === void 0) { override = false; }
        var title$ = !!title
            ? this.callback(title)
            : Observable.of('');
        title$.subscribe(function (res) {
            var fullTitle = '';
            if (!res) {
                var defaultTitle$ = _.has(_this.metaSettings, 'defaults.title')
                    ? _this.callback(_this.metaSettings.defaults.title)
                    : Observable.of('');
                defaultTitle$.subscribe(function (defaultTitle) {
                    if (!override && _this.metaSettings.pageTitleSeparator && _this.metaSettings.applicationName) {
                        _this.callback(_this.metaSettings.applicationName).subscribe(function (applicationName) {
                            fullTitle = !!applicationName ? _this.getTitleWithPositioning(defaultTitle, applicationName) : defaultTitle;
                            _this.updateTitle(fullTitle);
                        });
                    }
                    else
                        _this.updateTitle(defaultTitle);
                });
            }
            else {

                if (!override && _this.metaSettings.pageTitleSeparator && _this.metaSettings.applicationName) {
                    _this.callback(_this.metaSettings.applicationName).subscribe(function (applicationName) {
                        fullTitle = !!applicationName ? _this.getTitleWithPositioning(res, applicationName) : res;
                        _this.updateTitle(fullTitle);
                    });
                }
                else
                    _this.updateTitle(res);
            }
        });
        // hack due to not updating dom
        $('head meta[name="title"]').remove();
        $('head').prepend('<meta name="title" property="title" content="' + title + '">');
        $('head meta[name="og:title"]').remove();
        $('head').prepend('<meta name="og:title" peroperty="og:title" content="' + title + '">');
    };
    MetaService.prototype.setTag = function (key, value) {
        var _this = this;
        if (key === 'title')
            throw new Error("Attempt to set " + key + " through 'setTag': 'title' is a reserved tag name. "
                + "Please use 'MetaService.setTitle' instead.");
        value = value || _.get(this.metaSettings, "defaults." + key, '');
        var value$ = (key !== 'og:locale' && key !== 'og:locale:alternate')
            ? this.callback(value)
            : Observable.of(value);
        value$.subscribe(function (res) {
            _this.updateTag(key, res);
        });
        // hack due to not updating dom
        if (value) {
            $('head meta[name="' + key + '"]').remove();
            $('head').prepend('<meta name="' + key + '" property="' + key + '" content="' + value + '">');
        }
    };
    MetaService.prototype.update = function (currentUrl, metaSettings) {
        var _this = this;
        if (!metaSettings) {
            var fallbackTitle = _.get(this.metaSettings, 'defaults.title', '') || this.metaSettings['applicationName'];
            this.setTitle(fallbackTitle, true);
        }
        else {
            if (metaSettings.disabled) {
                this.update(currentUrl);
                return;
            }
            this.setTitle(metaSettings.title, metaSettings.override);
            Object.keys(metaSettings)
                .forEach(function (key) {
                    var value = metaSettings[key];
                    if (key === 'title' || key === 'override')
                        return;
                    else if (key === 'og:locale')
                        value = value.replace(/-/g, '_');
                    else if (key === 'og:locale:alternate') {
                        var currentLocale = metaSettings['og:locale'];
                        _this.updateLocales(currentLocale, metaSettings[key]);
                        return;
                    }
                    _this.setTag(key, value);

                });
        }
        Object.keys(_.get(this.metaSettings, 'defaults', {}))
            .forEach(function (key) {
                var value = _this.metaSettings.defaults[key];
                if ((!!metaSettings && (key in _this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override')
                    return;
                else if (key === 'og:locale')
                    value = value.replace(/-/g, '_');
                else if (key === 'og:locale:alternate') {
                    var currentLocale = _.get(metaSettings, 'og:locale', undefined);
                    _this.updateLocales(currentLocale, value);
                    return;
                }
                _this.setTag(key, value);
            });
        var url = ((this.metaSettings.applicationUrl || '/') + currentUrl)
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/\/$/g, '');
        this.setTag('og:url', url || '/');
    };
    MetaService.prototype.callback = function (value) {
        if (!!this.metaSettings.callback) {
            var value$ = this.metaSettings.callback(value);
            if (!isObservable(value$))
                return isPromise(value$)
                    ? Observable.fromPromise(value$)
                    : Observable.of(value$);
            return value$;
        }
        return Observable.of(value);
    };
    MetaService.prototype.getTitleWithPositioning = function (title, applicationName) {
        switch (this.metaSettings.pageTitlePositioning) {
            case PageTitlePositioning.AppendPageTitle:
                return applicationName + this.metaSettings.pageTitleSeparator + title;
            case PageTitlePositioning.PrependPageTitle:
                return title + this.metaSettings.pageTitleSeparator + applicationName;
            default:
                throw new Error("Invalid pageTitlePositioning specified [" + this.metaSettings.pageTitlePositioning + "]!");
        }
    };
    MetaService.prototype.updateTitle = function (title) {
        this.title.setTitle(title);
        // hack due to not updating dom
        $('head meta[name="title"]').remove();
        $('head').prepend('<meta name="title" property="title" content="' + title + '">');
        $('head meta[name="og:title"]').remove();
        $('head').prepend('<meta name="og:title" peroperty="og:title" content="' + title + '">');
        this.meta.updateTag({
            property: 'og:title',
            content: title
        });
    };
    ;
    MetaService.prototype.updateLocales = function (currentLocale, availableLocales) {
        var _this = this;
        currentLocale = currentLocale || _.get(this.metaSettings, 'defaults["og:locale"]', '');
        if (!!currentLocale && !!this.metaSettings.defaults)
            this.metaSettings.defaults['og:locale'] = currentLocale.replace(/_/g, '-');
        var elements = this.meta.getTags("property=\"og:locale:alternate\"");
        elements.forEach(function (element) {
            _this.meta.removeTagElement(element);
        });
        if (!!currentLocale && !!availableLocales) {
            availableLocales.split(',')
                .forEach(function (locale) {
                    if (currentLocale.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
                        _this.meta.addTag({
                            property: 'og:locale:alternate',
                            content: locale.replace(/-/g, '_')
                        });
                    }
                });
        }
    };
    MetaService.prototype.updateTag = function (key, value) {
        if (key.lastIndexOf('og:', 0) === 0)
            this.meta.updateTag({
                property: key,
                content: key === 'og:locale' ? value.replace(/-/g, '_') : value
            });
        else
            this.meta.updateTag({
                name: key,
                content: value
            });
        this.isMetaTagSet[key] = true;
        if (key === 'description') {
            this.meta.updateTag({
                property: 'og:description',
                content: value
            });
            if (value) {
                $('head meta[name="og:description"]').remove();
                $('head').prepend('<meta name="og:description" property="og:description" content="' + value + '">');
            }

        }
        else if (key === 'author') {
            this.meta.updateTag({
                property: 'og:author',
                content: value
            });
        }
        else if (key === 'publisher') {
            this.meta.updateTag({
                property: 'og:publisher',
                content: value
            });
        }
        else if (key === 'og:locale') {
            var availableLocales = _.get(this.metaSettings, 'defaults["og:locale:alternate"]', '');
            this.updateLocales(value, availableLocales);
            this.isMetaTagSet['og:locale:alternate'] = true;
        }
        else if (key === 'og:locale:alternate') {
            var currentLocale = this.meta.getTag('property="og:locale"').content;
            this.updateLocales(currentLocale, value);
            this.isMetaTagSet['og:locale'] = true;
        }
        // hack due to not updating dom
        if (value) {
            $('head meta[name="' + key + '"]').remove();
            $('head').prepend('<meta name="' + key + '" property="' + key + '" content="' + value + '">');
        }
    };
    return MetaService;
}());
export { MetaService };
MetaService.decorators = [
    { type: Injectable },
];
MetaService.ctorParameters = function () {
    return [
        { type: MetaLoader, },
        { type: Title, },
        { type: Meta, },
    ];
};