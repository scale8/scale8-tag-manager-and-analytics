import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const UpdateActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <EditIcon {...props} />
        </>
    );
};

export default UpdateActionIcon;
