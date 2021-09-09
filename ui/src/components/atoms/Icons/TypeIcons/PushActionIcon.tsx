import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const PushActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloudUploadIcon {...props} />
        </>
    );
};

export default PushActionIcon;
