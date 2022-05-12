export const generateRevisionName = (): string => {
    const now = new Date();
    return `Revision ${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB')}`;
};
