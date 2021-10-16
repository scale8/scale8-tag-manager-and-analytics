import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DeleteIcon {...props} />
        </>
    );
};

export default DeleteActionIcon;
