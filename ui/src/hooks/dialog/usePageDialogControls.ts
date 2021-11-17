import { useCallback, useEffect } from 'react';

const usePageDialogControls = (
    noChanges: boolean,
    successfullySaved: boolean,
    setPageHasChanges: (pageHasChanges: boolean) => void,
    handleDialogClose: (checkChanges: boolean) => void,
    pageRefresh: () => void,
    savedId?: string,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
): void => {
    const setHasChangesCallback = useCallback(setPageHasChanges, []);

    useEffect(() => {
        if (noChanges) {
            setHasChangesCallback(false);
        } else {
            setHasChangesCallback(true);
        }
    }, [noChanges, setHasChangesCallback]);

    const pageRefreshCallback = useCallback(pageRefresh, []);
    const handleDialogCloseCallback = useCallback(handleDialogClose, []);

    useEffect(() => {
        if (successfullySaved) {
            if (followUp !== undefined && savedId !== undefined) {
                followUp(savedId, pageRefreshCallback, handleDialogClose);
            } else {
                pageRefreshCallback();
                handleDialogClose(false);
            }
        }
    }, [successfullySaved, handleDialogCloseCallback, pageRefreshCallback]);
};

export { usePageDialogControls };
