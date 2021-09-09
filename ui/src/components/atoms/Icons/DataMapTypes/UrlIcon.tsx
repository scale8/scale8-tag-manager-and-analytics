import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TextIcon from '../TypeIcons/TextIcon';

const UrlIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextIcon {...props} />
        </>
    );
};

export default UrlIcon;
