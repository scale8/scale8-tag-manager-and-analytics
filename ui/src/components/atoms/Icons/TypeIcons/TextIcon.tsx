import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const TextIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextFieldsIcon {...props} />
        </>
    );
};

export default TextIcon;
