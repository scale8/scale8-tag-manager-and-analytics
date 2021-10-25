// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import { ConditionMode } from '../gql/generated/globalTypes';
import { Box } from '@mui/material';
import {
    buildConditionRuleCreateInput,
    ConditionRuleFormProps,
    ConditionRuleValues,
    useConditionRuleForm,
} from '../hooks/form/useConditionRuleForm';
import ConditionRuleForm from '../components/organisms/Forms/ConditionRuleForm';
import { DataContainer } from '../types/DataMapsTypes';
import { mockDataContainers } from './mock/MockDataContainers';

const dataContainers = mockDataContainers.defaultCase;

const ConditionFormTester: FC = () => {
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

    const formProps: ConditionRuleFormProps = {
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

    return (
        <Box p={3}>
            <ConditionRuleForm {...formProps} />
        </Box>
    );
};

export default ConditionFormTester;
