import { useState } from 'react';
import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
    EnvironmentVariableAddInput,
    EnvironmentVariableDeleteInput,
} from '../../../gql/generated/globalTypes';
import UpdateEnvironmentVariablesGetQuery from '../../../gql/queries/UpdateEnvironmentVariablesGetQuery';
import { UpdateEnvironmentVariablesGetData } from '../../../gql/generated/UpdateEnvironmentVariablesGetData';
import GQLError from '../../../components/atoms/GqlError';
import Loader from '../../../components/organisms/Loader';
import EnvironmentVariablesInput from '../../../components/atoms/EnvironmentVariablesInput';
import AddEnvironmentVariableQuery from '../../../gql/mutations/AddEnvironmentVariableQuery';
import DeleteEnvironmentVariableQuery from '../../../gql/mutations/DeleteEnvironmentVariableQuery';
import { DialogPageProps } from '../../../types/DialogTypes';
import { Box } from '@mui/material';
import { MainDrawerTitle } from '../../../components/molecules/MainDrawerTitle';
import { InfoButton } from '../../../components/molecules/InfoButton';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import { logError } from '../../../utils/logUtils';

const EnvironmentEditVariables: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [mustReset, setMustReset] = useState(false);

    const { loading, error, data, refetch, client } = useQuery<UpdateEnvironmentVariablesGetData>(
        UpdateEnvironmentVariablesGetQuery,
        {
            variables: { id: props.id },
        },
    );

    const [
        addEnvironmentVariable,
        {
            loading: addingEnvironmentVariable,
            data: addEnvironmentVariableResult,
            error: gqlErrorAddEnvironmentVariable,
        },
    ] = useMutation(AddEnvironmentVariableQuery);

    const [
        deleteEnvironmentVariable,
        {
            loading: deletingEnvironmentVariable,
            data: deleteEnvironmentVariableResult,
            error: gqlErrorDeleteEnvironmentVariable,
        },
    ] = useMutation(DeleteEnvironmentVariableQuery);

    if ((addEnvironmentVariableResult || deleteEnvironmentVariableResult) && mustReset) {
        (async () => {
            await client.cache.reset();
            await refetch();
            setMustReset(false);
        })();
    }

    if (loading || addingEnvironmentVariable || deletingEnvironmentVariable || !data || mustReset) {
        return <Loader />;
    }

    return (
        <>
            <MainDrawerTitle handleDialogClose={props.handleDialogClose}>
                Manage Environment Variables
                <InfoButton {...buildStandardFormInfo('appEnvironments', 'ManageVariables')} />
            </MainDrawerTitle>
            <Box p={3}>
                {error && <GQLError error={error} />}
                {gqlErrorAddEnvironmentVariable && (
                    <GQLError error={gqlErrorAddEnvironmentVariable} />
                )}
                {gqlErrorDeleteEnvironmentVariable && (
                    <GQLError error={gqlErrorDeleteEnvironmentVariable} />
                )}
                <EnvironmentVariablesInput
                    label="Environment Variables"
                    values={data.getEnvironment.environment_variables}
                    add={(key: string, value: string) => {
                        (async () => {
                            const environmentVariableAddInput: EnvironmentVariableAddInput = {
                                environment_id: props.id,
                                key,
                                value,
                            };
                            try {
                                await addEnvironmentVariable({
                                    variables: { environmentVariableAddInput },
                                });
                                setMustReset(true);
                            } catch (error) {
                                logError(error);
                            }
                        })();
                    }}
                    remove={(key: string) => {
                        (async () => {
                            const environmentVariableDeleteInput: EnvironmentVariableDeleteInput = {
                                environment_id: props.id,
                                key,
                            };
                            try {
                                await deleteEnvironmentVariable({
                                    variables: {
                                        environmentVariableDeleteInput,
                                    },
                                });
                                setMustReset(true);
                            } catch (error) {
                                logError(error);
                            }
                        })();
                    }}
                />
            </Box>
        </>
    );
};

export { EnvironmentEditVariables };
