import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogEntityHistory } from '../../../abstractions/DialogEntityHistory';

const TagHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="tags" {...props} />;
};

export { TagHistory };
