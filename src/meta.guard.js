import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MetaService } from './meta.service';
var MetaGuard = (function () {
    function MetaGuard(meta) {
        this.meta = meta;
    }
    MetaGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        var metaSettings = _.get(route.data, 'meta', undefined);
        this.meta.update(url, metaSettings);
        return true;
    };
    MetaGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    return MetaGuard;
}());
export { MetaGuard };
MetaGuard.decorators = [
    { type: Injectable },
];
MetaGuard.ctorParameters = function () { return [
    { type: MetaService, },
]; };
