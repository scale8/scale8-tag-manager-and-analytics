import { UTCTimestamp } from '../utils/DateTimeUtils';

export type TableRowBase = {
    id: string;
    createdAt: UTCTimestamp;
    updatedAt: UTCTimestamp;
};
