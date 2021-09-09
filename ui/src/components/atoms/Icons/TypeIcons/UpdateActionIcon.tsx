import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const UpdateActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <EditIcon {...props} />
        </>
    );
};

export default UpdateActionIcon;
