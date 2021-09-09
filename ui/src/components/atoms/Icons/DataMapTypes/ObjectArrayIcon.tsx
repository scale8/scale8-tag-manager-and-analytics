import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import ObjectsIcon from '../TypeIcons/ObjectsIcon';

const ObjectArrayIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ObjectsIcon {...props} />
        </>
    );
};

export default ObjectArrayIcon;
