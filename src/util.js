export function isPromise(obj) {
    return !!obj && typeof obj.then === 'function';
}
export function isObservable(obj) {
    return !!obj && typeof obj.subscribe === 'function';
}
