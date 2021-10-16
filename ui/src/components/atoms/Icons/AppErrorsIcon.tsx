import { FC } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import { SvgIconProps } from '@mui/material';

const AppErrorsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ErrorIcon {...props} />
        </>
    );
};

export default AppErrorsIcon;
