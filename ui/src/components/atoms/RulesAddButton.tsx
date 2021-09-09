import { FC, MouseEventHandler } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

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
                color="default"
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
