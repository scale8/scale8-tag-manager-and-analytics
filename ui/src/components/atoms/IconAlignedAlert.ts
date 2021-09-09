import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

const IconAlignedAlert = withStyles({
    icon: {
        alignItems: 'center',
    },
})(Alert);

export default IconAlignedAlert;
