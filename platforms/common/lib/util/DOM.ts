import { getTopWindow } from './WindowElement';

export default class DOM {
    private static readyCallbacks: (() => void)[] = [];
    private static loadedCallbacks: (() => void)[] = [];
    private static doc = getTopWindow().document;

    public static initReadyChecks(): void {
        const listener = () => {
            this.checkReady();
            this.checkLoaded();
        };
        this.doc.addEventListener('DOMContentLoaded', listener, false);
        this.doc.addEventListener('readystatechange', listener, false);
    }

    private static checkReady(): boolean {
        const ready = this.doc.readyState === 'complete' || this.doc.readyState === 'interactive';
        if (ready) {
            this.readyCallbacks.forEach((_) => _());
            this.readyCallbacks = []; //clear...
        }
        return ready;
    }

    private static checkLoaded(): boolean {
        const loaded = this.doc.readyState === 'complete';
        if (loaded) {
            this.loadedCallbacks.forEach((_) => _());
            this.loadedCallbacks = []; //clear...
        }
        return loaded;
    }

    public static isReady(cb: () => void = () => undefined): boolean {
        if (this.checkReady()) {
            cb();
            return true;
        } else {
            this.readyCallbacks.push(cb);
            return false;
        }
    }

    public static isLoaded(cb: () => void = () => undefined): boolean {
        if (this.checkLoaded()) {
            cb();
            return true;
        } else {
            this.loadedCallbacks.push(cb);
            return false;
        }
    }
}
