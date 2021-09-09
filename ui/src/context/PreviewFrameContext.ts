import { PreviewElementDetails, RevisionStatus, TagCode } from '../types/PreviewFrameTypes';
import { createContext, Dispatch, SetStateAction } from 'react';
import { ApolloError } from '@apollo/client';
import { PreviewFrameData } from '../gql/generated/PreviewFrameData';

export type PreviewFrameContext = {
    revisionStatus: RevisionStatus | undefined;
    previewFrameData: PreviewFrameData | undefined;
    previewFrameError: ApolloError | undefined;
    revisionTab: number;
    setRevisionTab: Dispatch<SetStateAction<number>>;
    highlightEnabled: boolean;
    toggleHighlight: () => void;
    flashTag: () => void;
    handleClose: () => void;
    handleLeaveDebugMode: () => void;
    currentTagCode: TagCode | undefined;
    setCurrentTagCode: Dispatch<SetStateAction<TagCode | undefined>>;
    gotoElement: PreviewElementDetails | undefined;
    setGotoElement: Dispatch<SetStateAction<PreviewElementDetails | undefined>>;
};

// Preview frame context
export const previewFrameContext = createContext<PreviewFrameContext>({
    revisionStatus: undefined,
    previewFrameData: undefined,
    previewFrameError: undefined,
    revisionTab: 0,
    setRevisionTab: () => {
        // Placeholder
    },
    highlightEnabled: false,
    toggleHighlight: () => {
        // Placeholder
    },
    flashTag: () => {
        // Placeholder
    },
    handleClose: () => {
        // Placeholder
    },
    handleLeaveDebugMode: () => {
        // Placeholder
    },
    currentTagCode: undefined,
    setCurrentTagCode: () => {
        // Placeholder
    },
    gotoElement: undefined,
    setGotoElement: () => {
        // Placeholder
    },
});
