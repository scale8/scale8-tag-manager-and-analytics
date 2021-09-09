import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const AddActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AddCircleOutlineIcon {...props} />
        </>
    );
};

export default AddActionIcon;
