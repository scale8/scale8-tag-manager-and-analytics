export const messageFromFrameEvent = (event: string, payload?: Record<string, unknown>): string => {
    return JSON.stringify({
        isS8FrameEvent: true,
        event,
        payload: payload === undefined ? {} : payload,
    });
};
