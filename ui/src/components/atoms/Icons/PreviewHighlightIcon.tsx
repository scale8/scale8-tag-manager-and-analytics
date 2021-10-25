import { FC } from 'react';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import { SvgIconProps } from '@mui/material';

const PreviewHighlightIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <FlipToFrontIcon {...props} />
        </>
    );
};

export default PreviewHighlightIcon;
