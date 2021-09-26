import { FC } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import { SvgIconProps } from '@material-ui/core';

const AppErrorsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ErrorIcon {...props} />
        </>
    );
};

export default AppErrorsIcon;
