import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import SelectAllIcon from '@material-ui/icons/SelectAll';

const SelectorIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SelectAllIcon {...props} />
        </>
    );
};

export default SelectorIcon;
