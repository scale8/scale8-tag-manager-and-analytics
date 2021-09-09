import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TvIcon from '@material-ui/icons/Tv';

const VisualActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TvIcon {...props} />
        </>
    );
};

export default VisualActionIcon;
