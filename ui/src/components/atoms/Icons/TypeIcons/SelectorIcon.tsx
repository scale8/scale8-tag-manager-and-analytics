import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import SelectAllIcon from '@mui/icons-material/SelectAll';

const SelectorIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SelectAllIcon {...props} />
        </>
    );
};

export default SelectorIcon;
