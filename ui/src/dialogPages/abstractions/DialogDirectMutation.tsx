import { FC, useEffect } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { useMutation } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { MutationFunctionOptions } from '@apollo/client/react/types/types';
import { FetchResult } from '@apollo/client/link/core/types';
import LoaderFull from '../../components/organisms/LoaderFull';
import { useLoggedInState } from '../../context/AppContext';
import { logError } from '../../utils/logUtils';

export type DialogMutationFunction = (options?: MutationFunctionOptions) => Promise<FetchResult>;

export type ExecuteMutationCallback = (
    mutationFunction: DialogMutationFunction,
    id: string,
    contextId: string,
    ids: string[],
    comments: string,
) => Promise<void>;

export type RenderDataProps = {
    data: any;
    handleDialogClose: (checkChanges: boolean) => void;
    name?: string;
};

export type DialogDirectMutationProps = DialogPageProps & {
    mutation: DocumentNode;
    comments?: string;
    executeMutationCallback: ExecuteMutationCallback;
    renderData?: FC<RenderDataProps>;
    checkCloseAndRefresh?: (data: any) => boolean;
};

const DialogDirectMutation: FC<DialogDirectMutationProps> = (props: DialogDirectMutationProps) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const {
        id,
        contextId,
        ids,
        handleDialogClose,
        pageRefresh,
        mutation,
        comments,
        executeMutationCallback,
        renderData,
        name,
    } = props;

    const [mutationFunction, { data, error: gqlError }] = useMutation(mutation);

    const checkCloseAndRefresh = (data: any) => {
        if (props.checkCloseAndRefresh === undefined) return false;
        return props.checkCloseAndRefresh(data);
    };

    useEffect(() => {
        (async () => {
            try {
                await executeMutationCallback(mutationFunction, id, contextId, ids, comments ?? '');
            } catch (error) {
                logError(error);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (gqlError) {
            setSnackbarError(gqlError);
            handleDialogClose(false);
        }

        if (data !== undefined && data !== null) {
            if (renderData === undefined || checkCloseAndRefresh(data)) {
                pageRefresh();
                handleDialogClose(false);
            }
        }
    }, [data]);

    if (data !== undefined && data !== null) {
        if (renderData !== undefined) {
            const Result = renderData;
            return <Result data={data} handleDialogClose={handleDialogClose} name={name} />;
        }
    }

    return <LoaderFull />;
};

export { DialogDirectMutation };
