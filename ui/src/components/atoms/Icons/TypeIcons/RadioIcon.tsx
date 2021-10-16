import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const RadioIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioButtonCheckedIcon {...props} />
        </>
    );
};

export default RadioIcon;
