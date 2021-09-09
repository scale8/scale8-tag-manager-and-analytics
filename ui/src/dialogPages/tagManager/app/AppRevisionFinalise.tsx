import { FC, useCallback, useEffect } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import { useMutation } from '@apollo/client';
import FinaliseRevisionQuery from '../../../gql/mutations/FinaliseRevisionQuery';
import Loader from '../../../components/organisms/Loader';
import FinalizeRevisionErrorDialog from '../../../components/organisms/FinalizeRevisionErrorDialog';
import { FinaliseRevision_finaliseRevision } from '../../../gql/generated/FinaliseRevision';
import { useLoggedInState } from '../../../context/AppContext';
import { logError } from '../../../utils/logUtils';

const AppRevisionFinalise: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const { id, handleDialogClose, followUp, pageRefresh } = props;

    const [mutationFunction, { data, loading, error: gqlError }] =
        useMutation(FinaliseRevisionQuery);

    const followUpCallback = followUp !== undefined ? useCallback(followUp, []) : undefined;

    const pageRefreshCallback = useCallback(pageRefresh, []);

    useEffect(() => {
        (async () => {
            try {
                await mutationFunction({
                    variables: {
                        finaliseRevisionInput: { revision_id: id },
                    },
                });
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

        if (
            data !== undefined &&
            data !== null &&
            (data.finaliseRevision === undefined || data.finaliseRevision.length === 0)
        ) {
            if (followUpCallback) {
                followUpCallback(id, pageRefreshCallback, handleDialogClose);
            } else {
                pageRefresh();
                handleDialogClose(false);
            }
        }
    }, [data]);

    if (loading || !data) {
        return <Loader />;
    }

    if (data.finaliseRevision === undefined || data.finaliseRevision.length === 0) {
        return null;
    }

    const finalizeRevisionErrors: FinaliseRevision_finaliseRevision[] = data.finaliseRevision;

    return (
        <FinalizeRevisionErrorDialog
            errors={finalizeRevisionErrors}
            handleClose={() => {
                handleDialogClose(true);
            }}
        />
    );
};

export { AppRevisionFinalise };
