import { FC } from 'react';
import { useQuery } from '@apollo/client';
import EnvironmentInstructionsGetQuery from '../gql/queries/EnvironmentInstructionsGetQuery';
import { EnvironmentInstructionsGetData } from '../gql/generated/EnvironmentInstructionsGetData';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import EnvironmentInstallInstructions from '../components/organisms/EnvironmentInstallInstructions';
import ExternalRedirectButton from '../components/atoms/ExternalRedirectButton';

type TagManagerInstallInstructionsProps = {
    environmentId: string;
    link: string;
    text: string;
};

const TagManagerInstallInstructions: FC<TagManagerInstallInstructionsProps> = (
    props: TagManagerInstallInstructionsProps,
) => {
    return QueryLoaderAndError<EnvironmentInstructionsGetData>(
        false,
        useQuery<EnvironmentInstructionsGetData>(EnvironmentInstructionsGetQuery, {
            variables: { id: props.environmentId },
        }),
        (data: EnvironmentInstructionsGetData) => {
            const dbTags = data.getEnvironment.revision?.tags ?? [];

            return (
                <>
                    <EnvironmentInstallInstructions
                        environmentName={data.getEnvironment.name}
                        environmentId={data.getEnvironment.id}
                        installDomain={data.getEnvironment.install_domain}
                        customDomain={data.getEnvironment.custom_domain}
                        mode={data.config.mode}
                        cname={data.getEnvironment.cname}
                        tags={dbTags
                            .filter((_) => !_.auto_load)
                            .map((_) => ({
                                name: _.name,
                                code: _.tag_code,
                                type: _.type,
                            }))}
                    />
                    <ExternalRedirectButton link={props.link} text={props.text} />
                </>
            );
        },
    );
};

export { TagManagerInstallInstructions };
