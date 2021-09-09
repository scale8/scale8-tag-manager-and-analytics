export const getTopWindow = (): Window => {
    return window.top as Window;
};

export const getQueryStringAsObject = (): { [k: string]: any } => {
    const qs = getTopWindow().location.search.replace(/^\?/, '');
    if (qs === '') return {};
    const pairs = qs.split('&');
    return pairs.reduce((obj, pair) => {
        const [key, value] = pair.split('=');
        const decodedValue = decodeURIComponent(value || '');
        if (obj.hasOwnProperty(key)) {
            //we have seen this property before, so now we need to check its an array...
            if (Array.isArray((obj as any)[key])) {
                //as this is an array already, pop the value in...
                (obj as any)[key].push(decodedValue);
            } else {
                //turn this into an array...
                (obj as any)[key] = [(obj as any)[key], decodedValue];
            }
        } else {
            (obj as any)[key] = decodedValue;
        }
        return obj;
    }, {});
};
