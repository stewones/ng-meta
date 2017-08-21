import { Observable } from 'rxjs/Observable';
export declare function isPromise(obj: any): obj is Promise<any>;
export declare function isObservable(obj: any | Observable<any>): obj is Observable<any>;
