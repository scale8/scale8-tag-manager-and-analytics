import { FC, MouseEventHandler } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type RulesButtonProps = {
    text: string;
    onClick: MouseEventHandler;
    disabled?: boolean;
};

const RulesAddButton: FC<RulesButtonProps> = (props: RulesButtonProps) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Button
                size="small"
                variant="outlined"
                onClick={props.onClick}
                startIcon={<AddIcon />}
                disabled={props.disabled}
            >
                {props.text}
            </Button>
        </Box>
    );
};
export default RulesAddButton;
