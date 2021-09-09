import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogEntityHistory } from '../../../abstractions/DialogEntityHistory';

const RuleHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="rules" {...props} />;
};

export { RuleHistory };
