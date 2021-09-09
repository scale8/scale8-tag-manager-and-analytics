import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogEntityHistory } from '../../../abstractions/DialogEntityHistory';

const RuleGroupHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="ruleGroups" {...props} />;
};

export { RuleGroupHistory };
