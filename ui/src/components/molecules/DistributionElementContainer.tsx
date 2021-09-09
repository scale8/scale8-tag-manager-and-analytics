import { ChangeEvent, FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Checkbox,
    Divider,
    FormControlLabel,
    Input,
    InputAdornment,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Slider,
} from '@material-ui/core';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: theme.spacing(2),
    },
    containerLeft: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        minHeight: 250,
    },
    input: {
        width: 64,
        '& input': {
            paddingLeft: 15,
            textAlign: 'center',
            zIndex: 9,
        },
        '& input:focus, & input:hover': {
            zIndex: 11,
        },
    },
    adornment: {
        position: 'absolute',
        right: 0,
        marginRight: 1,
        top: 13,
        zIndex: 10,
    },
    slider: {
        marginLeft: 18,
    },
    lock: {
        borderTop: '1px solid rgba(0, 0, 0, 0.42)',
        margin: 0,
        paddingLeft: 5,
    },
    lockLabel: {
        fontSize: '12px',
    },
    lockCheckbox: {
        padding: 0,
    },
    containerRight: {
        flexGrow: 1,
    },
    containerHeader: {
        margin: 0,
        padding: 0,
        position: 'relative',
        listStyle: 'none',
    },
    content: {
        padding: theme.spacing(2),
    },
    addButton: {},
    addButtonContainer: {
        width: '100%',
    },
}));

type DistributionElementContainerContainerProps = {
    children: ReactNode;
    title: string;
    id: string;
    locked: boolean;
    distribution: number;
    setActionGroupLock: (id: string, locked: boolean) => void;
    setDistributionValue: (id: string, value: number) => void;
    commitDistribution: () => void;
    actions: SectionAction[];
    readonly?: boolean;
};

const DistributionElementContainer: FC<DistributionElementContainerContainerProps> = (
    props: DistributionElementContainerContainerProps,
) => {
    const classes = useStyles();

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        props.setDistributionValue(
            props.id,
            (Array.isArray(newValue) ? newValue[0] : newValue) * 10,
        );
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.setDistributionValue(
            props.id,
            (event.target.value === '' ? 0 : Number(event.target.value)) * 10,
        );
    };

    return (
        <div className={classes.root}>
            <div className={classes.containerLeft}>
                <Input
                    disabled={props.readonly}
                    className={classes.input}
                    value={props.distribution / 10}
                    margin="dense"
                    onChange={handleInputChange}
                    onBlur={() => props.commitDistribution()}
                    inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                    endAdornment={
                        <InputAdornment className={classes.adornment} position="start">
                            %
                        </InputAdornment>
                    }
                />
                <Slider
                    disabled={props.readonly}
                    min={0}
                    step={1}
                    max={100}
                    className={classes.slider}
                    orientation="vertical"
                    value={props.distribution / 10}
                    onChangeCommitted={() => props.commitDistribution()}
                    onChange={handleSliderChange}
                    aria-labelledby="vertical-slider"
                />
                <FormControlLabel
                    classes={{
                        root: classes.lock,
                        label: classes.lockLabel,
                    }}
                    control={
                        <Checkbox
                            disabled={props.readonly}
                            className={classes.lockCheckbox}
                            checked={props.locked}
                            name="lock-checkbox"
                            onChange={(event) => {
                                props.setActionGroupLock(props.id, event.target.checked);
                            }}
                            color="primary"
                        />
                    }
                    label="Lock"
                />
            </div>
            <div className={classes.containerRight}>
                <ul className={classes.containerHeader}>
                    <ListItem>
                        <ListItemText primary={props.title} />
                        <ListItemSecondaryAction>
                            <SectionActionsSpeedDial
                                actions={props.actions}
                                id={props.id}
                                hide={props.readonly}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </ul>
                <Divider />
                <div className={classes.content}>{props.children}</div>
            </div>
        </div>
    );
};

export { DistributionElementContainer };
