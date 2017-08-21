import { Meta, Title } from '@angular/platform-browser';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import { MetaLoader } from './meta.loader';
export declare class MetaService {
    loader: MetaLoader;
    private readonly title;
    private readonly meta;
    private readonly metaSettings;
    private readonly isMetaTagSet;
    constructor(loader: MetaLoader, title: Title, meta: Meta);
    setTitle(title: string, override?: boolean): void;
    setTag(key: string, value: string): void;
    update(currentUrl: string, metaSettings?: any): void;
    private callback(value);
    private getTitleWithPositioning(title, applicationName);
    private updateTitle(title);
    private updateLocales(currentLocale, availableLocales);
    private updateTag(key, value);
}
