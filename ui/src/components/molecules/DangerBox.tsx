import { FC, ReactNode } from 'react';
import BoxedInputs from '../atoms/BoxedInputs';

const DangerBox: FC<{ children: ReactNode; dark?: boolean }> = (props: {
    children: ReactNode;
    dark?: boolean;
}) => {
    return (
        <BoxedInputs
            label="Danger"
            borderRadius={4}
            background={props.dark ? '#f5f5f5' : '#ffffff'}
            errorColor
        >
            {props.children}
        </BoxedInputs>
    );
};

export default DangerBox;
