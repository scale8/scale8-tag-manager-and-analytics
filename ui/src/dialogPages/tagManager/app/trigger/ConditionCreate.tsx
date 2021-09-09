import { FC } from 'react';
import { ConditionRuleCreate } from './ConditionRuleCreate';
import { ConditionMode } from '../../../../gql/generated/globalTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';

const ConditionCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <>
            <ConditionRuleCreate
                {...props}
                submitText={'Add Condition'}
                title={'Add Condition'}
                conditionMode={ConditionMode.CONDITION}
                infoKeyBase={'conditions'}
            />
        </>
    );
};

export { ConditionCreate };
