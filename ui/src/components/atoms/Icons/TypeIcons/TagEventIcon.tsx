import { FC } from 'react';
import LabelIcon from '@mui/icons-material/Label';
import { SvgIconProps } from '@mui/material';

const TagEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LabelIcon {...props} />
        </>
    );
};

export default TagEventIcon;
