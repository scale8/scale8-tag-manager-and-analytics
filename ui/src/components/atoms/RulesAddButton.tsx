import { FC, MouseEventHandler } from 'react';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles(() => ({
    addButtonContainer: {
        width: '100%',
    },
}));

type RulesButtonProps = {
    text: string;
    onClick: MouseEventHandler;
    disabled?: boolean;
};

const RulesAddButton: FC<RulesButtonProps> = (props: RulesButtonProps) => {
    const classes = useStyles();

    return (
        <div className={classes.addButtonContainer}>
            <Button
                size="small"
                variant="outlined"
                onClick={props.onClick}
                startIcon={<AddIcon />}
                disabled={props.disabled}
            >
                {props.text}
            </Button>
        </div>
    );
};
export default RulesAddButton;
