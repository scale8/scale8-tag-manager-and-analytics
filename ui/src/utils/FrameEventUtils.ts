import { FrameEvent } from '../types/PreviewFrameTypes';

const frameEventFromMessage = (msg: string): FrameEvent | null => {
    try {
        const jsonEvent = JSON.parse(msg);
        return jsonEvent.isS8FrameEvent ? (jsonEvent as FrameEvent) : null;
    } catch (err) {
        return null;
    }
};

const messageFromFrameEvent = (event: string, payload?: Record<string, unknown>): string => {
    return JSON.stringify({
        isS8FrameEvent: true,
        event,
        payload: payload === undefined ? {} : payload,
    });
};

export { frameEventFromMessage, messageFromFrameEvent };
