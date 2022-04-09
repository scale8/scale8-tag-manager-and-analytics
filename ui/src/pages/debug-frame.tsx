import { FC, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { PreviewElementDetails, RevisionStatus, TagCode } from '../types/PreviewFrameTypes';
import { previewFrameContext, PreviewFrameContext } from '../context/PreviewFrameContext';
import PreviewFrameQuery from '../gql/queries/PreviewFrameQuery';
import { PreviewFrameData } from '../gql/generated/PreviewFrameData';
import { frameEventFromMessage, messageFromFrameEvent } from '../utils/FrameEventUtils';
import PreviewLayout from '../components/templates/PreviewLayout';

const DebugFrame: FC = () => {
    const [revisionStatusString, setRevisionStatusString] = useState<string | undefined>(undefined);

    const [currentTagCode, setCurrentTagCode] = useState<TagCode | undefined>(undefined);

    const [gotoElement, setGotoElement] = useState<PreviewElementDetails | undefined>(undefined);

    const [highlightEnabled, setHighlightEnabled] = useState<boolean>(false);

    const [revisionTab, setRevisionTab] = useState(0);

    const revisionStatus = revisionStatusString ? JSON.parse(revisionStatusString) : undefined;

    const [loadPreview, { data, loading, error }] = useLazyQuery<PreviewFrameData>(
        PreviewFrameQuery,
        {
            variables: {
                platformId: revisionStatus?.platformId,
                appId: revisionStatus?.appId,
                revisionId: revisionStatus?.revisionId,
            },
        },
    );

    useEffect(() => {
        window.addEventListener('message', function (e) {
            const frameEvent = frameEventFromMessage(e.data);
            if (frameEvent !== null) {
                if (frameEvent.event === 'statusUpdate') {
                    const receivedRevisionStatus = frameEvent.payload as RevisionStatus;
                    const receivedRevisionStatusString = JSON.stringify(receivedRevisionStatus);
                    setRevisionStatusString(receivedRevisionStatusString);
                    if (receivedRevisionStatus.refreshTarget) {
                        loadPreview();
                    }
                }
                if (frameEvent.event === 'selectTag') {
                    setCurrentTagCode({
                        code: frameEvent.payload.code,
                        index: frameEvent.payload.index,
                    });
                }
                if (frameEvent.event === 'highlightersHidden') {
                    setHighlightEnabled(false);
                }
                if (frameEvent.event === 'highlightersVisible') {
                    setHighlightEnabled(true);
                }
            }
        });
        parent.postMessage(messageFromFrameEvent('ready'), '*');
    }, []);

    const previewFrameContextValue: PreviewFrameContext = {
        revisionStatus,
        previewFrameData: loading ? undefined : data,
        previewFrameError: error,
        revisionTab,
        setRevisionTab,
        highlightEnabled,
        toggleHighlight: () => {
            parent.postMessage(
                messageFromFrameEvent(highlightEnabled ? 'hideHighlighters' : 'showHighlighters'),
                '*',
            );
        },
        flashTag: () => {
            parent.postMessage(messageFromFrameEvent('flashTag', currentTagCode), '*');
        },
        handleClose: () => {
            parent.postMessage(messageFromFrameEvent('close'), '*');
        },
        handleLeaveDebugMode: () => {
            parent.postMessage(messageFromFrameEvent('leaveDebugMode'), '*');
        },
        currentTagCode,
        setCurrentTagCode,
        gotoElement,
        setGotoElement,
    };

    return (
        <previewFrameContext.Provider value={previewFrameContextValue}>
            <PreviewLayout />
        </previewFrameContext.Provider>
    );
};

export default DebugFrame;
