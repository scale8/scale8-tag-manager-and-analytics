import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import TvIcon from '@mui/icons-material/Tv';

const VisualActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TvIcon {...props} />
        </>
    );
};

export default VisualActionIcon;
