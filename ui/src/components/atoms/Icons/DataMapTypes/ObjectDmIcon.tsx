import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import ObjectIcon from '../TypeIcons/ObjectIcon';

const ObjectDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ObjectIcon {...props} />
        </>
    );
};

export default ObjectDmIcon;
