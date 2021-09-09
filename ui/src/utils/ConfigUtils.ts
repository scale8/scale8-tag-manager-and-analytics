export const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL ?? '';
};

export const getDocUrl = () => {
    return process.env.NEXT_PUBLIC_DOCUMENTATION_URL ?? '';
};

export const getCaptchaKey = () => {
    return process.env.NEXT_PUBLIC_CAPTCHA_KEY ?? '';
};

export const getStripeKey = () => {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
};

export const getNodeEnv = () => {
    return process.env.NODE_ENV ?? 'development';
};
