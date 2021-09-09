import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import ListIcon from '../TypeIcons/ListIcon';

const SelectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ListIcon {...props} />
        </>
    );
};

export default SelectIcon;
