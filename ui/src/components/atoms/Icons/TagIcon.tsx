import { FC } from 'react';
import LabelIcon from '@material-ui/icons/Label';
import { SvgIconProps } from '@material-ui/core';

const TagIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LabelIcon {...props} />
        </>
    );
};

export default TagIcon;
