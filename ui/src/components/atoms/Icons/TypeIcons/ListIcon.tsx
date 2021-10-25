import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';

const ListIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ViewListIcon {...props} />
        </>
    );
};

export default ListIcon;
