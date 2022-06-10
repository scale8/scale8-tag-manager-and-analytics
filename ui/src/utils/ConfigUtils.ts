export const getNodeEnv = () => {
    return process.env.NODE_ENV ?? 'development';
};

export const getIsCommercial = () => {
    return process.env.NEXT_PUBLIC_IS_COMMERCIAL === 'true';
};

export const getAnalyticsPollingFrequency = () => {
    return 1800000;
};

export const getApiUrl = (): string => {
    if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;

        //we are running in commercial production, the api should always point to api.scale8.com
        if (hostname === 'ui.scale8.com') {
            return 'https://api.scale8.com';
        }

        if (process.env.NEXT_PUBLIC_IS_ROUTER_MODE !== undefined) {
            return `${window.location.protocol}//${hostname}${port === '' ? '' : ':' + port}`;
        }

        const path = window.location.pathname;
        const qs = window.location.search;
        const isDev = getNodeEnv() === 'development';
        const isCommercial = getIsCommercial();
        const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
        if (isDev && isCommercial && isLocalHost) {
            // noinspection HttpUrlsUsage
            location.replace(`https://ui-dev.scale8.com:8443${path}${qs}`);
            return '';
        }
        if (isDev && hostname === 'localhost') {
            location.replace(`http://127.0.0.1${port === '' ? '' : `:${port}`}${path}${qs}`);
            return '';
        }
        if (isDev && isLocalHost) {
            if (port === '8080') {
                return 'http://127.0.0.1:8080';
            }
            return 'http://127.0.0.1:8082';
        }
        if (port === '8443') {
            return 'https://api-dev.scale8.com:8443';
        }
        // noinspection HttpUrlsUsage
        return 'http://api-dev.scale8.com:8082';
    }

    return 'http://127.0.0.1:8082';
};

export const getDocUrl = () => {
    return process.env.NEXT_PUBLIC_DOCUMENTATION_URL ?? 'https://scale8.github.io/docs';
};
