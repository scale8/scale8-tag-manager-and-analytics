import { snakeToTitleCase } from './TextUtils';

const getTimezoneLabel = (timeZone: string): string => {
    if (timeZone === 'UTC') {
        return timeZone;
    } else {
        return snakeToTitleCase(timeZone);
    }
};

export { getTimezoneLabel };
