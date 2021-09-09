import { FC, useContext } from 'react';
import { PreviewFrameRevisionInfo } from './PreviewFrameRevisionInfo';
import { PreviewFrameTagInfo } from './PreviewFrameTagInfo';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

const PreviewFrameMain: FC = () => {
    const { currentTagCode } = useContext(previewFrameContext);

    return currentTagCode === undefined ? <PreviewFrameRevisionInfo /> : <PreviewFrameTagInfo />;
};

export { PreviewFrameMain };
