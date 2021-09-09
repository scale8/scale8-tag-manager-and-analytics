import { FC } from 'react';
import { useQuery } from '@apollo/client';
import TagInstructionsQuery from '../../../../gql/queries/TagInstructionsQuery';
import { TagInstructionsData } from '../../../../gql/generated/TagInstructionsData';
import TagInstallInstructionsDialog from '../../../../components/organisms/TagInstallInstructionsDialog';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { queryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';

const TagInstallInstructions: FC<DialogPageProps> = (props: DialogPageProps) => {
    return queryLoaderAndError<TagInstructionsData>(
        false,
        useQuery<TagInstructionsData>(TagInstructionsQuery, {
            variables: { id: props.id },
        }),
        (data: TagInstructionsData) => {
            return (
                <TagInstallInstructionsDialog
                    handleDialogClose={props.handleDialogClose}
                    name={data.getTag.name}
                    code={data.getTag.tag_code}
                    type={data.getTag.type}
                    autoLoad={data.getTag.auto_load}
                />
            );
        },
    );
};

export { TagInstallInstructions };
