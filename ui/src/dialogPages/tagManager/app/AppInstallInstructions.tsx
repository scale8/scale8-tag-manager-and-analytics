import { FC } from 'react';
import { useQuery } from '@apollo/client';
import EnvironmentInstallInstructionsDialog from '../../../components/organisms/EnvironmentInstallInstructionsDialog';
import { DialogPageProps } from '../../../types/DialogTypes';
import { QueryLoaderAndError } from '../../../abstractions/QueryLoaderAndError';
import { AppInstructionsGetData } from '../../../gql/generated/AppInstructionsGetData';
import AppInstructionsGetQuery from '../../../gql/queries/AppInstructionsGetQuery';
import { useConfigState } from '../../../context/AppContext';

const AppInstallInstructions: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { mode } = useConfigState();

    return QueryLoaderAndError<AppInstructionsGetData>(
        false,
        useQuery<AppInstructionsGetData>(AppInstructionsGetQuery, {
            variables: { id: props.id },
        }),
        (data: AppInstructionsGetData) => {
            const environment = data.getApp.environments[0];
            const dbTags = environment.revision?.tags ?? [];

            return (
                <EnvironmentInstallInstructionsDialog
                    environmentName={environment.name}
                    environmentId={environment.id}
                    title="Application Installation Instructions"
                    installDomain={environment.install_domain}
                    installEndpoint={environment.install_endpoint}
                    handleDialogClose={props.handleDialogClose}
                    cname={environment.cname}
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

export default AppInstallInstructions;
