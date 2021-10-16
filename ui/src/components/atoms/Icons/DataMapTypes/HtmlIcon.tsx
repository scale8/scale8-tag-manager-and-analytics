import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CodeTypeIcon from '../TypeIcons/CodeTypeIcon';

const BooleanIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CodeTypeIcon {...props} />
        </>
    );
};

export default BooleanIcon;
