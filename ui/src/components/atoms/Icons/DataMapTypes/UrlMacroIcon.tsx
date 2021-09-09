import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TextIcon from '../TypeIcons/TextIcon';

const UrlMacroIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextIcon {...props} />
        </>
    );
};

export default UrlMacroIcon;
