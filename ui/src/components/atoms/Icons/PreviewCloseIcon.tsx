import { FC } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { SvgIconProps } from '@material-ui/core';

const PreviewCloseIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloseIcon {...props} />
        </>
    );
};

export default PreviewCloseIcon;
