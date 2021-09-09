import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

export default class UserDebugMode {
    private static _isEnabled = false;
    private static readonly location = getTopWindow().location;
    private static readonly storage = getTopWindow().localStorage;

    private static urlIsFlagged(): boolean {
        return (
            UserDebugMode.location.href.match(/s8prev=/gi) !== null ||
            UserDebugMode.location.href.match(/s8debug/gi) !== null
        );
    }

    private static check(): boolean {
        if (!this._isEnabled) {
            //check url to see if flag is set
            if (this.urlIsFlagged()) {
                UserDebugMode.storage.setItem('s8debug', '1');
            }
            //check local storage to see if set in previous session
            this._isEnabled = UserDebugMode.storage.getItem('s8debug') === '1';
        }
        return this._isEnabled;
    }

    public static leave(): void {
        UserDebugMode.storage.removeItem('s8prev');
        UserDebugMode.storage.removeItem('s8debug');
        if (this.urlIsFlagged()) {
            UserDebugMode.location.href = UserDebugMode.location.href
                .replace(/s8prev=[a-zA-Z0-9]+/, '')
                .replace(/s8debug/, '');
            UserDebugMode.location.reload();
        }
    }

    public static isEnabled(): boolean {
        return this.check();
    }
}
