import { FC } from 'react';
import { useQuery } from '@apollo/client';
import EnvironmentInstallInstructionsDialog from '../../../components/organisms/EnvironmentInstallInstructionsDialog';
import EnvironmentInstructionsGetQuery from '../../../gql/queries/EnvironmentInstructionsGetQuery';
import { EnvironmentInstructionsGetData } from '../../../gql/generated/EnvironmentInstructionsGetData';
import { DialogPageProps } from '../../../types/DialogTypes';
import { queryLoaderAndError } from '../../../abstractions/QueryLoaderAndError';
import { useConfigState } from '../../../context/AppContext';

const AppEnvironmentsInstallInstructions: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { mode } = useConfigState();

    return queryLoaderAndError<EnvironmentInstructionsGetData>(
        false,
        useQuery<EnvironmentInstructionsGetData>(EnvironmentInstructionsGetQuery, {
            variables: { id: props.id },
        }),
        (data: EnvironmentInstructionsGetData) => {
            const dbTags = data.getEnvironment.revision?.tags ?? [];

            return (
                <EnvironmentInstallInstructionsDialog
                    environmentName={data.getEnvironment.name}
                    environmentId={data.getEnvironment.id}
                    title="Environment Installation Instructions"
                    installDomain={data.getEnvironment.install_domain}
                    customDomain={data.getEnvironment.custom_domain}
                    handleDialogClose={props.handleDialogClose}
                    cname={data.getEnvironment.cname}
                    mode={mode}
                    tags={dbTags
                        .filter((_) => !_.auto_load)
                        .map((_) => ({
                            name: _.name,
                            code: _.tag_code,
                            type: _.type,
                        }))}
                />
            );
        },
    );
};

export { AppEnvironmentsInstallInstructions };
