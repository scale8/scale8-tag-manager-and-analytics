import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import ViewListIcon from '@material-ui/icons/ViewList';

const ListIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ViewListIcon {...props} />
        </>
    );
};

export default ListIcon;
