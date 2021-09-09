import { UTCTimestamp } from './DateTimeUtils';
import { TableRowBase } from '../types/TableRow';

export type ObjectWithTableBaseElements = {
    id: string;
    created_at: S8DateTime;
    updated_at: S8DateTime;
};

export const extractBaseColumns = (o: ObjectWithTableBaseElements): TableRowBase => ({
    id: o.id,
    createdAt: o.created_at as UTCTimestamp,
    updatedAt: o.updated_at as UTCTimestamp,
});
