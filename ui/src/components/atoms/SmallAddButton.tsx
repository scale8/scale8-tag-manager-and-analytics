import { FC, MouseEventHandler } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const SmallAddButton: FC<{
    addButtonText: string;
    addButtonClick: MouseEventHandler;
    disabled?: boolean;
    hideIcon?: boolean;
}> = ({ addButtonClick, addButtonText, disabled, hideIcon }) => {
    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={!hideIcon ? <AddIcon /> : null}
            onClick={addButtonClick}
            disabled={disabled}
        >
            <Box fontSize="12px" lineHeight="12px">
                {addButtonText}
            </Box>
        </Button>
    );
};
