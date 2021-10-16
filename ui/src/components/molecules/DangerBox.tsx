import { FC, ReactNode } from 'react';
import BoxedInputs from '../atoms/BoxedInputs';
import { useTheme } from '@mui/material';

const DangerBox: FC<{ children: ReactNode; dark?: boolean }> = (props: {
    children: ReactNode;
    dark?: boolean;
}) => {
    const theme = useTheme();
    return (
        <BoxedInputs
            label="Danger"
            color={theme.palette.error.main}
            borderRadius={4}
            background={props.dark ? '#f5f5f5' : '#ffffff'}
        >
            {props.children}
        </BoxedInputs>
    );
};

export default DangerBox;
