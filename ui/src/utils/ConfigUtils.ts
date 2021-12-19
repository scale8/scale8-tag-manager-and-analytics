export const getNodeEnv = () => {
    return process.env.NODE_ENV ?? 'development';
};

export const getIsCommercial = () => {
    return process.env.NEXT_PUBLIC_IS_COMMERCIAL === 'true';
};

export const getApiUrl = (): string => {
    if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const path = window.location.pathname;
        const qs = window.location.search;
        const protocol = window.location.protocol;
        const isDev = getNodeEnv() === 'development';
        const isCommercial = getIsCommercial();
        const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
        if (isDev && isCommercial && isLocalHost) {
            // noinspection HttpUrlsUsage
            location.replace(
                `${protocol}//ui-dev.scale8.com${port === '' ? '' : `:${port}`}${path}${qs}`,
            );
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

export const getCaptchaKey = () => {
    return process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? '7d48f80a-6fe0-463d-9f66-bcd0b63fa597';
};

export const getStripeKey = () => {
    return (
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        'pk_test_51Is6gjBQQKPlxhLIymx0LwDABz9Cfbetf2nfYZ4fubyxH58hK73mrvpoOT8BL37WpK7WY9nxIilbWpPxlPhhWLiw002V0CW0VX'
    );
};
