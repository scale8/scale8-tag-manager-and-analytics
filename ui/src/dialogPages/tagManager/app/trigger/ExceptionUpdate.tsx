import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { ConditionRuleUpdate } from './ConditionRuleUpdate';

const ExceptionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <>
            <ConditionRuleUpdate
                {...props}
                submitText={'Update Exception'}
                title={'Update Exception'}
                infoKeyBase={'exceptions'}
            />
        </>
    );
};

export { ExceptionUpdate };
