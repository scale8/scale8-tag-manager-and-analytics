import { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import EnvironmentInstructionsGetQuery from '../gql/queries/EnvironmentInstructionsGetQuery';
import { EnvironmentInstructionsGetData } from '../gql/generated/EnvironmentInstructionsGetData';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import EnvironmentInstallInstructions from '../components/organisms/EnvironmentInstallInstructions';
import ConfirmationButton from '../components/atoms/ConfirmationButton';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import SelectInput from '../components/atoms/InputTypes/SelectInput';
import { useConfigState } from '../context/AppContext';

type TagManagerInstallInstructionsProps = {
    environments: { id: string; name: string }[];
    onConfirm?: () => void;
    link?: string;
    text: string;
};

const TagManagerInstallInstructionsIdSelected: FC<{
    environmentId: string;
    onConfirm: () => void;
    text: string;
}> = ({ environmentId, onConfirm, text }) => {
    const { mode } = useConfigState();
    return QueryLoaderAndError<EnvironmentInstructionsGetData>(
        false,
        useQuery<EnvironmentInstructionsGetData>(EnvironmentInstructionsGetQuery, {
            variables: { id: environmentId },
        }),
        (data: EnvironmentInstructionsGetData) => {
            const dbTags = data.getEnvironment.revision?.tags ?? [];

            return (
                <>
                    <EnvironmentInstallInstructions
                        environmentName={data.getEnvironment.name}
                        environmentId={data.getEnvironment.id}
                        installDomain={data.getEnvironment.install_domain}
                        installEndpoint={data.getEnvironment.install_endpoint}
                        mode={mode}
                        cname={data.getEnvironment.cname}
                        tags={dbTags
                            .filter((_) => !_.auto_load)
                            .map((_) => ({
                                name: _.name,
                                code: _.tag_code,
                                type: _.type,
                            }))}
                    />
                    <ConfirmationButton onConfirm={onConfirm} text={text} />
                </>
            );
        },
    );
};

const TagManagerInstallInstructions: FC<TagManagerInstallInstructionsProps> = (
    props: TagManagerInstallInstructionsProps,
) => {
    const [environmentId, setEnvironmentId] = useState('');

    useEffect(() => {
        if (props.environments.length > 0) {
            setEnvironmentId(props.environments[0].id);
        }
    }, [props.environments]);

    const router = useRouter();

    const onConfirm = props.onConfirm
        ? props.onConfirm
        : () => {
              router.push(props.link ?? '').then();
          };

    if (environmentId === '') {
        return null;
    }

    if (props.environments.length === 1) {
        return (
            <TagManagerInstallInstructionsIdSelected
                environmentId={props.environments[0].id}
                onConfirm={onConfirm}
                text={props.text}
            />
        );
    }

    return (
        <>
            <Box>Please select the environment to install:</Box>
            <Box my={2} width="100%">
                <SelectInput
                    sx={{ width: 200 }}
                    value={environmentId}
                    setValue={(v) => setEnvironmentId(v)}
                    optionValues={[]}
                    keyTextValues={props.environments.map((_) => ({ key: _.id, text: _.name }))}
                    name="installation-type"
                    required
                />
            </Box>
            <TagManagerInstallInstructionsIdSelected
                environmentId={environmentId}
                onConfirm={onConfirm}
                text={props.text}
            />
        </>
    );
};
export { TagManagerInstallInstructions };
