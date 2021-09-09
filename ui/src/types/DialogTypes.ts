import { FC } from 'react';

export type DialogPageProps = {
    pageRefresh: () => void;
    handleDialogClose: (checkChanges: boolean) => void;
    setPageHasChanges: (pageHasChanges: boolean) => void;
    id: string;
    contextId: string;
    ids: string[];
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void;
    name?: string;
    readOnly: boolean;
};

export type DialogBaseProps = {
    open: boolean;
    handleDialogClose: (checkChanges: boolean) => void;
    width?: number;
    secondaryPageComponent?: FC;
};
