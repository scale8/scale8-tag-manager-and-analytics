export const calculateDeltaPercentage = (c: number, p: number): number => {
    if (c === 0) return -100;
    return ((c - p) / c) * 100;
};

export const roundNumber = (num: number, scale: number): number => {
    if (!('' + num).includes('e')) {
        return +(Math.round(+(num + 'e+' + scale)) + 'e-' + scale);
    } else {
        const arr = ('' + num).split('e');
        let sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(Math.round(+(+arr[0] + 'e' + sig + (+arr[1] + scale))) + 'e-' + scale);
    }
};
