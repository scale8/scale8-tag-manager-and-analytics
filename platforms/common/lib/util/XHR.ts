interface XHRCreateOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
    contentType?: string;
    headers?: Map<string, string>;
    withCredentials?: boolean;
    timeoutMS?: number;
}

export interface XHRResponse {
    ok: boolean;
    status: number;
    xhr: XMLHttpRequest;
}

export default class XHR {
    public static create(uri: string, options: XHRCreateOptions = {}): Promise<XHRResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const method = options.method ?? 'GET';
            xhr.open(method, uri, true);
            if (typeof options.contentType === 'string') {
                xhr.setRequestHeader('Content-Type', options.contentType);
            }
            Array.from(options.headers ?? new Map<string, string>()).forEach((_) =>
                xhr.setRequestHeader(_[0], _[1]),
            );
            xhr.withCredentials = options.withCredentials ?? false;
            xhr.timeout = options.timeoutMS ?? 5000;
            xhr.onload = () => {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 400,
                    status: xhr.status,
                    xhr: xhr,
                });
            };
            xhr.onerror = () => {
                reject(`Failed to make request to ${uri}`);
            };
            if (method === 'GET') {
                xhr.send(null); //no body to send...
            } else {
                xhr.send(options.body ?? '');
            }
        });
    }
}
