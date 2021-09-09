import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TextIcon from '../TypeIcons/TextIcon';

const EmailIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextIcon {...props} />
        </>
    );
};

export default EmailIcon;
