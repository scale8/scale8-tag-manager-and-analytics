import { Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AlertProps } from '@mui/material/Alert/Alert';

const IconAlignedAlert = styled(Alert)<AlertProps>(() => ({
    '& .MuiAlert-icon': {
        alignItems: 'center',
    },
}));

export default IconAlignedAlert;
