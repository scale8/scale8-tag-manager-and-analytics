import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const CodeTypeIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CodeIcon {...props} />
        </>
    );
};

export default CodeTypeIcon;
