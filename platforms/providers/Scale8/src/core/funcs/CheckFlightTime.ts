export const checkFlightTime = (
    startDate: string | undefined,
    endDate: string | undefined,
): boolean => {
    if (startDate !== undefined && endDate !== undefined) {
        return (
            new Date().getUTCMilliseconds() >= new Date(startDate).getUTCMilliseconds() &&
            new Date().getUTCMilliseconds() <= new Date(endDate).getUTCMilliseconds()
        );
    } else if (startDate !== undefined) {
        return new Date().getUTCMilliseconds() >= new Date(startDate).getUTCMilliseconds();
    } else if (endDate !== undefined) {
        return new Date().getUTCMilliseconds() <= new Date(endDate).getUTCMilliseconds();
    } else {
        return true;
    }
};
