import { FC } from 'react';
import { AlertWarning } from './AlertWarning';
import { PageActionProps, pageActions } from '../../actions/PageActions';

export const AlertRevisionFinal: FC<{
    pageActionProps: PageActionProps;
    revisionId: string;
    navigateBack: () => void;
}> = ({ pageActionProps, revisionId, navigateBack }) => {
    return (
        <AlertWarning>
            This revision has been marked as final. No further changes are possible. Please{' '}
            <span
                style={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    pageActions.duplicateAppRevision(
                        pageActionProps,
                        revisionId,
                        (
                            id: string,
                            pageRefresh: () => void,
                            handleDialogClose: (checkChanges: boolean) => void,
                        ) => {
                            handleDialogClose(false);
                            navigateBack();
                        },
                    );
                }}
            >
                <b>clone</b>
            </span>{' '}
            the revision to continue working on it.
        </AlertWarning>
    );
};
