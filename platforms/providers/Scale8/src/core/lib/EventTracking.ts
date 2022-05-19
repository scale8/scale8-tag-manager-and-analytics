import Context from './Context';
import XHR, { XHRResponse } from '../../../../../common/lib/util/XHR';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

export default class EventTracking {
    private static getParams(extra: { [k: string]: string } = {}) {
        const w = getTopWindow();
        return [
            ['url', w.location.href],
            ['referrer', w.document.referrer],
            ['p_x', `${w.screen.width}`],
            ['p_y', `${w.screen.height}`],
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
            this.getParams(eventGroup ? { event_group: eventGroup } : {});
        return XHR.create(url);
    }

    public static async trackError(err: ErrorEvent): Promise<XHRResponse> {
        const stackTrace = typeof err.error === 'object' ? (err.error as Error).stack : undefined;
        const payload: { [k: string]: string } = {
            error_file: err.filename,
            error_message: err.message,
            error_column: err.colno.toString(),
            error_row: err.lineno.toString(),
        };
        if (stackTrace !== undefined) {
            payload['error_trace'] = stackTrace;
        }
        const url = Context.getServer() + '/e/error?' + this.getParams(payload);
        return XHR.create(url);
    }
}
