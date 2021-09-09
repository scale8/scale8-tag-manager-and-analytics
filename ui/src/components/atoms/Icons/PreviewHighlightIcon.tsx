import { FC } from 'react';
import FlipToFrontIcon from '@material-ui/icons/FlipToFront';
import { SvgIconProps } from '@material-ui/core';

const PreviewHighlightIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <FlipToFrontIcon {...props} />
        </>
    );
};

export default PreviewHighlightIcon;
