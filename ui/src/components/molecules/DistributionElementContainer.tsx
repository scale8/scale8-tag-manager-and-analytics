import { ChangeEvent, FC, ReactNode } from 'react';
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Input,
    InputAdornment,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Slider,
} from '@mui/material';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';

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
        <Box
            sx={{
                display: 'flex',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                marginBottom: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                    minHeight: '250px',
                }}
            >
                <Input
                    disabled={props.readonly}
                    sx={{
                        width: '64px',
                        '& input': {
                            paddingLeft: '15px',
                            textAlign: 'center',
                            zIndex: 9,
                        },
                        '& input:focus, & input:hover': {
                            zIndex: 11,
                        },
                    }}
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
                        <InputAdornment
                            sx={{
                                position: 'absolute',
                                right: 0,
                                marginRight: 1,
                                top: 13,
                                zIndex: 10,
                            }}
                            position="start"
                        >
                            %
                        </InputAdornment>
                    }
                />
                <Slider
                    size="small"
                    disabled={props.readonly}
                    min={0}
                    step={1}
                    max={100}
                    sx={{ marginLeft: '18px' }}
                    orientation="vertical"
                    value={props.distribution / 10}
                    onChangeCommitted={() => props.commitDistribution()}
                    onChange={handleSliderChange}
                    aria-labelledby="vertical-slider"
                />
                <FormControlLabel
                    sx={{
                        borderTop: '1px solid rgba(0, 0, 0, 0.42)',
                        margin: 0,
                        paddingLeft: '5px',
                        '& .MuiFormControlLabel-label': {
                            fontSize: '12px',
                        },
                    }}
                    control={
                        <Checkbox
                            disabled={props.readonly}
                            sx={{ padding: 0 }}
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
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Box
                    component="ul"
                    sx={{
                        margin: 0,
                        padding: 0,
                        position: 'relative',
                        listStyle: 'none',
                    }}
                >
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
                </Box>
                <Divider />
                <Box sx={{ padding: 2 }}>{props.children}</Box>
            </Box>
        </Box>
    );
};

export { DistributionElementContainer };
