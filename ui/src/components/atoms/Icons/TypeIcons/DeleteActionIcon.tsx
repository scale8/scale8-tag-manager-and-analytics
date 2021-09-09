import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DeleteIcon {...props} />
        </>
    );
};

export default DeleteActionIcon;
