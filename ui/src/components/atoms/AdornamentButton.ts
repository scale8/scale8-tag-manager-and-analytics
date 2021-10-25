import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const AdornmentButton = styled(Button)({
    textTransform: 'none',
    lineHeight: 1,
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0 3px',
    '&:hover, &.open': {
        color: 'rgba(0, 0, 0, 0.87)',
        border: '1px solid #25302e',
        backgroundColor: 'rgba(37, 48, 46, 0.04)',
    },
});

export default AdornmentButton;
