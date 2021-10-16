import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AddCircleOutlineIcon {...props} />
        </>
    );
};

export default AddActionIcon;
