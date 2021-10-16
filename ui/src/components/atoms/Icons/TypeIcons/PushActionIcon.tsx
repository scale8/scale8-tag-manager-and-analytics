import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PushActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloudUploadIcon {...props} />
        </>
    );
};

export default PushActionIcon;
