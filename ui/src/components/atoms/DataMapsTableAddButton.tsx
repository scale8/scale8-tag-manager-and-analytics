import { MouseEventHandler } from 'react';
import { FC } from 'react';
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

const DataMapsTableAddButton: FC<RulesButtonProps> = (props: RulesButtonProps) => {
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
export default DataMapsTableAddButton;
