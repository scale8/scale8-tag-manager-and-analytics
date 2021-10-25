import { FC } from 'react';
import LabelIcon from '@mui/icons-material/Label';
import { SvgIconProps } from '@mui/material';

const TagIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LabelIcon {...props} />
        </>
    );
};

export default TagIcon;
