import { FC, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import Loader from '../../components/organisms/Loader';
import { ExecuteMutationCallback } from './DialogDirectMutation';
import { useLoggedInState } from '../../context/AppContext';
import { logError } from '../../utils/logUtils';

export type inDialogMutationProps = {
    id: string;
    contextId?: string;
    ids?: string[];
    comments?: string;
    mutation: DocumentNode;
    executeMutationCallback: ExecuteMutationCallback;
    onMutationComplete: () => void;
};

const InDialogMutation: FC<inDialogMutationProps> = (props: inDialogMutationProps) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const { id, contextId, ids, mutation, comments, executeMutationCallback, onMutationComplete } =
        props;

    const [mutationFunction, { data, error: gqlError }] = useMutation(mutation);

    useEffect(() => {
        (async () => {
            try {
                await executeMutationCallback(
                    mutationFunction,
                    id,
                    contextId ?? '',
                    ids ?? [],
                    comments ?? '',
                );
            } catch (error) {
                logError(error);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (gqlError) {
            setSnackbarError(gqlError);
            onMutationComplete();
        }

        if (data !== undefined && data !== null) {
            onMutationComplete();
        }
    }, [data, gqlError]);

    return <Loader />;
};

export { InDialogMutation };
