import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import SelectorIcon from '../TypeIcons/SelectorIcon';

const DomSelectorIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SelectorIcon {...props} />
        </>
    );
};

export default DomSelectorIcon;
