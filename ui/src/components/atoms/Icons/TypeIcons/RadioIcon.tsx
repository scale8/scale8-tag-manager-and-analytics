import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

const RadioIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioButtonCheckedIcon {...props} />
        </>
    );
};

export default RadioIcon;
