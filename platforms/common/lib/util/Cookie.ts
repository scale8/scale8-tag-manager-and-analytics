export const getCookieItem = (key: string, decode = true): string | null => {
    const value =
        document.cookie.replace(
            new RegExp(
                '(?:(?:^|.*;)\\s*' +
                    encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') +
                    '\\s*\\=\\s*([^;]*).*$)|^.*$',
            ),
            '$1',
        ) || null;
    if (value === null) {
        return null;
    } else {
        return decode ? decodeURIComponent(value) : value;
    }
};

export const setCookieItem = (
    key: string,
    value: string,
    options?: {
        domain?: string;
        path?: string;
        expires?: string;
        secure?: string;
        sameSite?: string;
    },
    encode = true,
): boolean => {
    document.cookie =
        encodeURIComponent(key) +
        '=' +
        (encode ? encodeURIComponent(value) : value) +
        (typeof options?.expires === 'string' ? '; expires=' + options?.expires : '') +
        (typeof options?.domain === 'string' ? '; domain=' + options?.domain : '') +
        (typeof options?.path === 'string' ? '; path=' + options?.path : '') +
        (typeof options?.secure === 'string' ? '; secure' : '');
    return true;
};
