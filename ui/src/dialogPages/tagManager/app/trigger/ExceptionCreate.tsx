import { FC } from 'react';
import { ConditionRuleCreate } from './ConditionRuleCreate';
import { ConditionMode } from '../../../../gql/generated/globalTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';

const ExceptionCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <>
            <ConditionRuleCreate
                {...props}
                submitText={'Add Exception'}
                title={'Add Exception'}
                conditionMode={ConditionMode.EXCEPTION}
                infoKeyBase={'exceptions'}
            />
        </>
    );
};

export { ExceptionCreate };
