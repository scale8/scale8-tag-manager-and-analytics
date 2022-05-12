import { DataContainer } from '../../src/types/DataMapsTypes';
import {
    buildConditionRuleCreateInput,
    ConditionRuleFormProps,
    ConditionRuleValues,
    useConditionRuleForm,
} from '../../src/hooks/form/useConditionRuleForm';
import { ConditionMode } from '../../src/gql/generated/globalTypes';
import { mockDataContainers } from './MockDataContainers';

export const useMockConditionFormProps: () => ConditionRuleFormProps = () => {
    const dataContainers = mockDataContainers.defaultCase;

    const submitForm = async (conditionRuleValues: ConditionRuleValues) => {
        const conditionRuleCreateInput = buildConditionRuleCreateInput(
            'ruleId',
            ConditionMode.EXCEPTION,
            conditionRuleValues,
        );
        console.log({
            variables: { conditionRuleCreateInput },
        });
    };

    const formInitialState = {
        name: '',
        dataContainerId: '',
        match: '',
        matchId: '',
        matchCondition: '',
        matchKey: '',
        dataMapValue: '',
        comments: '',
    };

    const availableDataContainers: DataContainer[] = dataContainers;

    const conditionRuleFormValues = useConditionRuleForm(
        formInitialState,
        submitForm,
        availableDataContainers,
    );

    return {
        ...conditionRuleFormValues,
        gqlError: undefined,
        submitText: 'Submit Condition',
        title: 'Submit Condition',
        dataContainers: availableDataContainers.map((dataContainer) => ({
            key: dataContainer.id,
            text: dataContainer.name,
        })),
        handleDialogClose: () => {
            // not in dialog
        },
        consentPurposes: [
            {
                id: 1,
                name: 'Store and/or access information on a device',
            },
            {
                id: 2,
                name: 'Select basic ads',
            },
        ],
        consentVendors: [
            {
                id: 1,
                name: 'Exponential Interactive, Inc d/b/a VDX.tv',
            },
            {
                id: 2,
                name: 'Captify Technologies Limited',
            },
            {
                id: 4,
                name: 'Roq.ad Inc.',
            },
        ],
    };
};
