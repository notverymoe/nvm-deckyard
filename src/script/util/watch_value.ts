import { Disposable, DisposeGuard } from "./disposable";

export interface ReadonlyWatchValue<T> {
    watch(callback: (n: T, o: T) => void, only_changed?: boolean): Disposable;
    readonly value: T;
}

export class WatchValue<T> implements Disposable, ReadonlyWatchValue<T> {
    private listeners = new Set<(n: T, o: T) => void>();

    constructor(private __value: T, private readonly transform: (v: T) => T = v => v) {}

    dispose(): void {
        this.clear();
    }

    watch(callback: (n: T, o: T) => void, only_changed = false): Disposable {
        const cb = !this.listeners.has(callback) ? callback : (n: T, o: T) => callback(n, o);
        this.listeners.add(cb);
        if (!only_changed) cb(this.__value, this.__value);
        return new DisposeGuard(() => this.listeners.delete(cb));
    }

    clear() {
        this.listeners.clear();
    }

    set value(val: T) {
        let newVal = this.transform(val);
        if (newVal === this.__value) return;

        let old      = this.__value;
        this.__value = newVal;
        for(const callback of [...this.listeners.values()]) {
            callback(this.__value, old);
        };
    }

    get value() {
        return this.__value;
    }
}
