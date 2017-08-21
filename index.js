import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MetaGuard } from './src/meta.guard';
import { MetaLoader, MetaStaticLoader } from './src/meta.loader';
import { MetaService } from './src/meta.service';
export * from './src/models/page-title-positioning';
export * from './src/meta.guard';
export * from './src/meta.loader';
export * from './src/meta.service';
export function metaFactory() {
    return new MetaStaticLoader();
}
var MetaModule = (function () {
    function MetaModule(parentModule) {
        if (parentModule)
            throw new Error('MetaModule already loaded; import in root module only.');
    }
    MetaModule.forRoot = function (configuredProvider) {
        if (configuredProvider === void 0) { configuredProvider = {
            provide: MetaLoader,
            useFactory: (metaFactory)
        }; }
        return {
            ngModule: MetaModule,
            providers: [
                configuredProvider,
                MetaGuard,
                MetaService
            ]
        };
    };
    return MetaModule;
}());
export { MetaModule };
MetaModule.decorators = [
    { type: NgModule },
];
MetaModule.ctorParameters = function () { return [
    { type: MetaModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
