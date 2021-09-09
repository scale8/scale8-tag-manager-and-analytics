import Random from '../../../../../common/lib/util/Random';

export const getFinalUrl = (url: string, cacheBust: boolean) => {
    const generateCacheBusterUrl = (u: string): string => {
        const cacheBuster = `cache-buster=${Random.numberBetween(1, 1e9)}`;
        if (u.indexOf('?') > -1) {
            return u.replace('?', `?${cacheBuster}&`);
        } else if (u.indexOf('#') > -1) {
            return u.replace('#', `?${cacheBuster}#`);
        } else {
            return `${u}?${cacheBuster}`;
        }
    };
    return cacheBust ? generateCacheBusterUrl(url) : url;
};
