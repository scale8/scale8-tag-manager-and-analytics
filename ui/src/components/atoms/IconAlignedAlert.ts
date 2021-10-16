import { Alert } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

const IconAlignedAlert = withStyles({
    icon: {
        alignItems: 'center',
    },
})(Alert);

export default IconAlignedAlert;
