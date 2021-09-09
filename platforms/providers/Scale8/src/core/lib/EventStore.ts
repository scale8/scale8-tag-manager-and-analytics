import { TagCode } from '../../../../../common/types/Types';

type CustomerBrowserEvent = {
    customEvent: CustomEvent;
    resetStateTimeout?: number;
};

export default class EventStore {
    private static readonly state: Map<string, { [k: string]: any }> = new Map();
    private static readonly event: Map<string, CustomerBrowserEvent> = new Map();

    public static getStoreKey(eventId: string, tagCode: TagCode): string {
        return `${tagCode.code}-${tagCode.index}-${eventId}`;
    }

    public static getEventState(eventId: string, tagCode: TagCode): { [k: string]: any } {
        const eventState = this.state.get(this.getStoreKey(eventId, tagCode));
        if (eventState === undefined) {
            const newEventState = {};
            this.state.set(this.getStoreKey(eventId, tagCode), newEventState);
            return newEventState;
        }
        return eventState;
    }

    public static setCustomBrowserEvent(
        eventId: string,
        tagCode: TagCode,
        customEvent: CustomEvent,
        timeout?: number,
    ): void {
        this.event.set(this.getStoreKey(eventId, tagCode), {
            customEvent: customEvent,
            resetStateTimeout: timeout,
        });
    }

    public static setCustomEventResetStateTimeout(
        eventId: string,
        tagCode: TagCode,
        timeout: number | undefined,
    ): void {
        const customBrowserEvent = this.event.get(this.getStoreKey(eventId, tagCode));
        if (customBrowserEvent !== undefined) {
            if (customBrowserEvent.resetStateTimeout !== undefined) {
                clearTimeout(customBrowserEvent.resetStateTimeout);
            }
            this.event.set(this.getStoreKey(eventId, tagCode), {
                customEvent: customBrowserEvent.customEvent,
                resetStateTimeout: timeout,
            });
        }
    }

    public static getCustomBrowserEvent(eventId: string, tagCode: TagCode): CustomerBrowserEvent {
        const customBrowserEvent = this.event.get(this.getStoreKey(eventId, tagCode));
        if (customBrowserEvent === undefined) {
            console.trace();
            throw new Error('Failed to find custom event');
        }
        return customBrowserEvent;
    }

    public static clearEventState(eventId: string, tagCode: TagCode): void {
        const eventState = this.getEventState(eventId, tagCode);
        Object.keys(eventState).forEach((k) => {
            delete eventState[k];
        });
    }
}
