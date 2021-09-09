import { FC, useEffect, useState } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import DeletePreviewDialogContent from '../../components/organisms/DeletePreviewDialogContent';
import GQLError from '../../components/atoms/GqlError';
import Loader from '../../components/organisms/Loader';
import { ExecuteMutationCallback } from './DialogDirectMutation';
import { FormMutationData } from '../../hooks/form/useFormValidation';
import { InDialogMutation } from './InDialogMutation';
import { logError } from '../../utils/logUtils';

export type DialogDeletePreviewProps = DialogPageProps & {
    mutation: DocumentNode;
    executePreviewMutationCallback: ExecuteMutationCallback;
    executeMutationCallback: ExecuteMutationCallback;
    buildText: (formMutationData: FormMutationData) => string;
    buildTextNoGroups: (formMutationData: FormMutationData) => string;
    buildGroups: (
        formMutationData: FormMutationData,
    ) => { title: string; items: { name: string; id: string }[] }[];
    disableComments?: boolean;
};

const DialogDeletePreview: FC<DialogDeletePreviewProps> = (props: DialogDeletePreviewProps) => {
    const [deleting, setDeleting] = useState(false);
    const [comments, setComments] = useState('');

    const {
        id,
        mutation,
        executePreviewMutationCallback,
        executeMutationCallback,
        buildText,
        buildTextNoGroups,
        buildGroups,
    } = props;

    const [mutationFunction, { data, loading, error: gqlError }] = useMutation(mutation);

    useEffect(() => {
        (async () => {
            try {
                await executePreviewMutationCallback(mutationFunction, id, '', [], '');
            } catch (error) {
                logError(error);
            }
        })();
    }, [id]);

    if (gqlError) {
        return <GQLError error={gqlError} />;
    }

    if (loading || !data) {
        return <Loader />;
    }

    const handleCancel = () => {
        props.handleDialogClose(true);
    };

    const handleConfirm = () => {
        setDeleting(true);
    };

    if (deleting) {
        return (
            <InDialogMutation
                comments={comments}
                executeMutationCallback={executeMutationCallback}
                mutation={mutation}
                id={id}
                onMutationComplete={() => {
                    setDeleting(false);
                    props.pageRefresh();
                    props.handleDialogClose(false);
                }}
            />
        );
    }

    return (
        <DeletePreviewDialogContent
            comments={comments}
            setComments={setComments}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            text={buildText(data)}
            textNoGroups={buildTextNoGroups(data)}
            groups={buildGroups(data)}
        />
    );
};

export { DialogDeletePreview };
