import Context from './Context';
import XHR, { XHRResponse } from '../../../../../common/lib/util/XHR';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

export default class EventTracking {
    private static getParams(extra: { [k: string]: string } = {}) {
        const w = getTopWindow();
        return [
            ['url', w.location.href],
            ['referrer', w.document.referrer],
            ...Object.entries(extra),
        ]
            .reduce(function (s, v) {
                return v[1].length > 0 ? s + '&' + v[0] + '=' + encodeURIComponent(v[1]) : s;
            }, '')
            .substr(1);
    }

    public static async track(event: string, eventGroup?: string): Promise<XHRResponse> {
        const url =
            Context.getServer() +
            '/e/' +
            event +
            '?' +
            this.getParams(eventGroup ? { group: eventGroup } : {});
        return XHR.create(url);
    }
}
