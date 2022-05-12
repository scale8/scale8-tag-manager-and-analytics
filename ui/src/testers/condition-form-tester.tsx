// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import { Box } from '@mui/material';
import ConditionRuleForm from '../components/organisms/Forms/ConditionRuleForm';
import { useMockConditionFormProps } from '../../tests/componentsMocks/useMockConditionFormProps';

const ConditionFormTester: FC = () => {
    const formProps = useMockConditionFormProps();

    return (
        <Box p={3}>
            <ConditionRuleForm {...formProps} />
        </Box>
    );
};

export default ConditionFormTester;
