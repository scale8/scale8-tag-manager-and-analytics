import { MouseEventHandler } from 'react';
import { FC } from 'react';
import { Box } from '@mui/material';
import { SmallAddButton } from './SmallAddButton';

type RulesButtonProps = {
    text: string;
    onClick: MouseEventHandler;
    disabled?: boolean;
};

const DataMapsTableAddButton: FC<RulesButtonProps> = (props: RulesButtonProps) => {
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <SmallAddButton
                addButtonText={props.text}
                addButtonClick={props.onClick}
                disabled={props.disabled}
            />
        </Box>
    );
};
export default DataMapsTableAddButton;
