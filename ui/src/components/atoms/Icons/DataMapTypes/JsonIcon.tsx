import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CodeTypeIcon from '../TypeIcons/CodeTypeIcon';

const JsonIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CodeTypeIcon {...props} />
        </>
    );
};

export default JsonIcon;
