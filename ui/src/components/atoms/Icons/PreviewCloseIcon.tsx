import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconProps } from '@mui/material';

const PreviewCloseIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloseIcon {...props} />
        </>
    );
};

export default PreviewCloseIcon;
