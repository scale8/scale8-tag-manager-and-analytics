import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { ConditionRuleUpdate } from './ConditionRuleUpdate';

const ConditionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <>
            <ConditionRuleUpdate
                {...props}
                submitText={'Update Condition'}
                title={'Update Condition'}
                infoKeyBase={'conditions'}
            />
        </>
    );
};

export { ConditionUpdate };
