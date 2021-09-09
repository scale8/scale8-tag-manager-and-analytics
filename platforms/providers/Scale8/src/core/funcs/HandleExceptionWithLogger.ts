export const handleExceptionWithLogger = (e: any, errHandler: (m: string) => any) => {
    if (e instanceof Error) {
        errHandler(e.message);
    } else if (typeof e === 'string') {
        errHandler(e);
    } else {
        errHandler('Something has gone wrong');
    }
};
