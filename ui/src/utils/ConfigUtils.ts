export const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8082';
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

export const getNodeEnv = () => {
    return process.env.NODE_ENV ?? 'development';
};
