import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import TextIcon from '../TypeIcons/TextIcon';

const TextAreaArrayIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextIcon {...props} />
        </>
    );
};

export default TextAreaArrayIcon;
