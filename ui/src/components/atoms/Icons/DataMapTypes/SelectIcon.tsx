import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import ListIcon from '../TypeIcons/ListIcon';

const SelectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ListIcon {...props} />
        </>
    );
};

export default SelectIcon;
