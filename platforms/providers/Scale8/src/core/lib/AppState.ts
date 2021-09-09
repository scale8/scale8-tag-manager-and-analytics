import ObjectReference from '../../../../../common/lib/util/ObjectReference';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

const S8_APP_DATA_KEY = '_s8_app_state';
const FETCH_S8_APP_DATA = () => getTopWindow().localStorage.getItem(S8_APP_DATA_KEY) || '{}';

export default class AppState {
    private static state: { [s: string]: any } = JSON.parse(FETCH_S8_APP_DATA());
    private static pageState: { [s: string]: any } = JSON.parse(FETCH_S8_APP_DATA());
    private static readonly updateHooks: (() => void)[] = [];

    public static refreshData(): void {
        this.state = JSON.parse(FETCH_S8_APP_DATA());
        this.pageState = JSON.parse(FETCH_S8_APP_DATA());
    }

    public static addUpdateHook(cb: () => void): void {
        this.updateHooks.push(cb);
    }

    public static dump(): { [s: string]: any } {
        return this.pageState;
    }

    public static get(k: string): any {
        return ObjectReference.getReferenceFromPath(k, this.pageState);
    }

    public static set(k: string, v: any, pageOnly = false): void {
        ObjectReference.setValueFromPath(k, this.pageState, v, true);
        if (!pageOnly) {
            //this needs to persist...
            ObjectReference.setValueFromPath(k, this.state, v, true);
            getTopWindow().localStorage.setItem(S8_APP_DATA_KEY, JSON.stringify(this.state));
        }
        this.updateHooks.forEach((_) => _());
    }
}
