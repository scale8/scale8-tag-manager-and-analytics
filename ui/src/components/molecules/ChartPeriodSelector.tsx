import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
    Box,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateRangePicker } from 'materialui-daterange-picker';
import { ChartPeriodProps, ChartPeriodType } from '../../hooks/chart/useChartPeriod';
import {
    addDaysUTC,
    addMonthsUTC,
    dateToUTCTimestamp,
    displayDayMonth,
    displayMonthYear,
    isSameMonthUTC,
    isThisMonthUTC,
    isTodayUTC,
    startOfThisMonthUTC,
    startOfTodayUTC,
    subDaysUTC,
    subMonthsUTC,
    UTCTimestamp,
} from '../../utils/DateTimeUtils';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const useStyles = makeStyles(() => ({
    selectRoot: {
        '&:focus': {
            backgroundColor: '#ffffff',
        },
        width: '150px',
    },
    arrowButton: {
        padding: 0,
        backgroundColor: 'transparent!important',
    },
    arrowIconForward: {
        transform: 'rotate(180deg)',
    },
}));

const ArrowBlock: FC<{
    onPrevClick: () => void;
    onNextClick: () => void;
    nextDisabled: boolean;
}> = (props: { onPrevClick: () => void; onNextClick: () => void; nextDisabled: boolean }) => {
    const { onPrevClick, onNextClick, nextDisabled } = props;
    const classes = useStyles();
    return (
        <>
            <IconButton
                className={classes.arrowButton}
                onClick={onPrevClick}
                disableRipple
                size="large"
            >
                <ArrowBackIosIcon />
            </IconButton>
            <IconButton
                className={classes.arrowButton}
                onClick={onNextClick}
                disabled={nextDisabled}
                disableRipple
                size="large"
            >
                <ArrowBackIosIcon className={classes.arrowIconForward} />
            </IconButton>
        </>
    );
};

export type ChartPeriodSelectorProps = ChartPeriodProps & {
    ticks: number;
    type: 'app' | 'endpoint';
};

const ChartPeriodSelector: FC<ChartPeriodSelectorProps> = (props: ChartPeriodSelectorProps) => {
    const classes = useStyles();
    const theme = useTheme();

    const [rangeAnchorEl, setRangeAnchorEl] = useState<Element | null>(null);
    const [selectValue, setSelectValue] = useState<string>('');
    const [selectDisplay, setSelectDisplay] = useState<string>('');

    const { period, setPeriod, date, setDate, from, setFrom, to, setTo, ticks } = props;

    const setPeriodValues = (period: ChartPeriodType, date?: UTCTimestamp) => {
        setPeriod(period);
        setDate(date);
        setFrom(undefined);
        setTo(undefined);
        setSelectValue('');
        setSelectDisplay('');
    };

    const selectValuePeriod: { v: string; p: ChartPeriodType }[] = [
        {
            v: 'Today',
            p: 'day',
        },
        {
            v: 'Realtime',
            p: 'realtime',
        },
        {
            v: 'Last 7 days',
            p: '7d',
        },
        {
            v: 'Last 30 days',
            p: '30d',
        },
        {
            v: 'Month to Date',
            p: 'month',
        },
        {
            v: 'Last month',
            p: 'month',
        },
        {
            v: 'Last 6 months',
            p: '6mo',
        },
        {
            v: 'Last 12 months',
            p: '12mo',
        },
        {
            v: 'Custom Range',
            p: 'custom',
        },
    ];

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        const m = selectValuePeriod.find((_) => value === _.v);
        if (m === undefined) {
            setSelectValue(value);
        } else {
            if (value === 'Today') {
                setPeriodValues(m.p, startOfTodayUTC);
            } else if (value === 'Month to Date') {
                setPeriodValues(m.p, startOfThisMonthUTC);
            } else if (value === 'Last month') {
                setPeriodValues(m.p, subMonthsUTC(startOfThisMonthUTC, 1));
            } else {
                setPeriodValues(m.p);
            }
        }
    };

    const rangeRef = useRef<Element>();
    const rangeOpen = Boolean(rangeAnchorEl);

    function handleRangeClose() {
        setRangeAnchorEl(null);
    }

    useEffect(() => {
        if (period === 'day') {
            if (date !== undefined) {
                if (isTodayUTC(date)) {
                    setSelectValue('Today');
                    setSelectDisplay('');
                } else {
                    setSelectValue('');
                    setSelectDisplay(displayDayMonth(date));
                }
            }
        } else if (period === 'month') {
            if (date !== undefined) {
                if (isThisMonthUTC(date)) {
                    setSelectValue('Month to Date');
                    setSelectDisplay('');
                } else if (isSameMonthUTC(subMonthsUTC(startOfThisMonthUTC, 1), date)) {
                    setSelectValue('Last month');
                    setSelectDisplay(displayMonthYear(date));
                } else {
                    setSelectValue('');
                    setSelectDisplay(displayMonthYear(date));
                }
            }
        } else if (period === 'custom') {
            if (from === undefined || to === undefined) {
                setRangeAnchorEl(rangeRef.current as Element);
            } else {
                setSelectDisplay(`${displayDayMonth(from)} - ${displayDayMonth(to)}`);
            }
        } else {
            const m = selectValuePeriod.find((_) => period === _.p);

            if (m) {
                setSelectValue(m.v);
                setSelectDisplay('');
            }
        }
    }, [period, date, from, to]);

    return (
        <Box display="flex" alignItems="center">
            {period === 'day' && date !== undefined && (
                <ArrowBlock
                    onPrevClick={() => {
                        setDate(subDaysUTC(date, 1));
                    }}
                    onNextClick={() => {
                        setDate(addDaysUTC(date, 1));
                    }}
                    nextDisabled={isTodayUTC(date)}
                />
            )}

            {period === 'month' && date !== undefined && (
                <ArrowBlock
                    onPrevClick={() => {
                        setDate(subMonthsUTC(date, 1));
                    }}
                    onNextClick={() => {
                        setDate(addMonthsUTC(date, 1));
                    }}
                    nextDisabled={isThisMonthUTC(date)}
                />
            )}

            {period === 'realtime' && (
                <Box position="relative" marginTop="5px">
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={30}
                        style={{ color: '#e5e5e5' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={100 - ticks}
                        size={30}
                        style={{
                            position: 'absolute',
                            left: 0,
                            color: props.type === 'app' ? '#44cce0' : '#ff0084',
                        }}
                    />
                </Box>
            )}

            <Box height={5} width={theme.spacing(2)} />
            <FormControl variant="outlined" size="small">
                <InputLabel
                    style={{
                        backgroundColor: '#ffffff',
                        paddingLeft: 5,
                        paddingRight: 5,
                        marginLeft: -5,
                    }}
                    id="period-label"
                    shrink={true}
                >
                    Period
                </InputLabel>
                <Select
                    ref={rangeRef}
                    classes={{ root: classes.selectRoot }}
                    value={selectValue}
                    displayEmpty
                    renderValue={(value): ReactNode => {
                        if (selectDisplay !== '') {
                            return selectDisplay;
                        }
                        return value as string;
                    }}
                    onChange={handleChange}
                >
                    <MenuItem value="Today">Today</MenuItem>
                    <MenuItem value="Realtime">Realtime</MenuItem>
                    <Divider />
                    <MenuItem value="Last 7 days">Last 7 days</MenuItem>
                    <MenuItem value="Last 30 days">Last 30 days</MenuItem>
                    <Divider />
                    <MenuItem value="Month to Date">Month to Date</MenuItem>
                    <MenuItem value="Last month">Last month</MenuItem>
                    <Divider />
                    <MenuItem value="Last 6 months">Last 6 months</MenuItem>
                    <MenuItem value="Last 12 months">Last 12 months</MenuItem>
                    <Divider />
                    <MenuItem value="Custom Range">Custom Range</MenuItem>
                </Select>
            </FormControl>
            <Popover open={rangeOpen} anchorEl={rangeAnchorEl}>
                <DateRangePicker
                    definedRanges={[]}
                    open={true}
                    toggle={handleRangeClose}
                    closeOnClickOutside={false}
                    onChange={({ endDate, startDate }) => {
                        if (endDate !== undefined && startDate !== undefined) {
                            setDate(undefined);
                            setFrom(dateToUTCTimestamp(startDate, true));
                            setTo(dateToUTCTimestamp(endDate, true));
                            handleRangeClose();
                        }
                    }}
                />
            </Popover>
        </Box>
    );
};

export default ChartPeriodSelector;
