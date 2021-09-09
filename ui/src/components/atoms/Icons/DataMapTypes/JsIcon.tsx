import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CodeTypeIcon from '../TypeIcons/CodeTypeIcon';

const JsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CodeTypeIcon {...props} />
        </>
    );
};

export default JsIcon;
