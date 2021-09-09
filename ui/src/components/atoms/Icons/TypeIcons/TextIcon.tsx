import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const TextIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TextFieldsIcon {...props} />
        </>
    );
};

export default TextIcon;
