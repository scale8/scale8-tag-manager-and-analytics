import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
} from '@mui/material';
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
import { DateRangePicker } from '@scale8/mui-daterange-picker';
import RefreshIcon from '@mui/icons-material/Refresh';

const ArrowBlock: FC<{
    onPrevClick: () => void;
    onNextClick: () => void;
    nextDisabled: boolean;
}> = (props: { onPrevClick: () => void; onNextClick: () => void; nextDisabled: boolean }) => {
    const { onPrevClick, onNextClick, nextDisabled } = props;
    return (
        <>
            <IconButton
                sx={{
                    padding: '0!important',
                    backgroundColor: 'transparent!important',
                }}
                onClick={onPrevClick}
                disableRipple
                size="large"
            >
                <ArrowBackIosIcon />
            </IconButton>
            <IconButton
                sx={{
                    padding: '0!important',
                    backgroundColor: 'transparent!important',
                }}
                onClick={onNextClick}
                disabled={nextDisabled}
                disableRipple
                size="large"
            >
                <ArrowBackIosIcon
                    sx={{
                        transform: 'rotate(180deg)',
                    }}
                />
            </IconButton>
        </>
    );
};

export type ChartPeriodSelectorProps = ChartPeriodProps & {
    ticks: number;
    refreshNow: () => void;
    type: 'app' | 'endpoint';
};

const ChartPeriodSelector: FC<ChartPeriodSelectorProps> = (props: ChartPeriodSelectorProps) => {
    const [rangeAnchorEl, setRangeAnchorEl] = useState<Element | null>(null);
    const [selectValue, setSelectValue] = useState<string>('');
    const [selectDisplay, setSelectDisplay] = useState<string>('');

    const { period, setPeriod, date, setDate, from, setFrom, to, setTo, ticks, refreshNow } = props;

    const setPeriodValues = (period: ChartPeriodType, date?: UTCTimestamp) => {
        setPeriod(period);
        setDate(date);
        setFrom(undefined);
        setTo(undefined);
        setSelectValue('');
        setSelectDisplay('');
    };

    const selectValuePeriod: { v: string; p: ChartPeriodType }[] = useMemo(
        () => [
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
        ],
        [],
    );

    const rangeRef = useRef<Element>();
    const rangeOpen = Boolean(rangeAnchorEl);

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        const m = selectValuePeriod.find((_) => value === _.v);
        if (m === undefined) {
            setSelectValue(value);
        } else {
            if (value === 'Custom Range') {
                setRangeAnchorEl(rangeRef.current as Element);
            } else if (value === 'Today') {
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
            if (from !== undefined && to !== undefined) {
                setSelectDisplay(`${displayDayMonth(from)} - ${displayDayMonth(to)}`);
            }
        } else {
            const m = selectValuePeriod.find((_) => period === _.p);

            if (m) {
                setSelectValue(m.v);
                setSelectDisplay('');
            }
        }
    }, [period, date, from, to, selectValuePeriod]);

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
                        sx={{ color: '#e5e5e5' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={100 - ticks}
                        size={30}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            color: props.type === 'app' ? '#44cce0' : '#ff0084',
                        }}
                    />
                </Box>
            )}

            <Box height={5} sx={{ width: (theme) => theme.spacing(2) }} />
            <FormControl variant="outlined" size="small">
                <InputLabel
                    sx={{
                        backgroundColor: '#ffffff',
                        paddingLeft: '5px',
                        paddingRight: '8px',
                        marginLeft: '-3px',
                    }}
                    id="period-label"
                    shrink={true}
                >
                    Period
                </InputLabel>
                <Select
                    label="Period"
                    ref={rangeRef}
                    sx={{
                        '& .MuiInputBase-input': {
                            '&:focus': {
                                backgroundColor: '#ffffff',
                            },
                            width: '150px',
                        },
                    }}
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
                    toggle={() => {
                        console.log(close);
                        handleRangeClose();
                    }}
                    closeOnClickOutside={true}
                    onChange={({ endDate, startDate }) => {
                        if (endDate !== undefined && startDate !== undefined) {
                            setPeriod('custom');
                            setDate(undefined);
                            setFrom(dateToUTCTimestamp(startDate, true));
                            setTo(dateToUTCTimestamp(endDate, true));
                            handleRangeClose();
                        }
                    }}
                />
            </Popover>
            <Box mx={1}>
                <IconButton
                    edge="end"
                    aria-label="refresh"
                    onClick={() => {
                        refreshNow();
                    }}
                    size="large"
                >
                    <RefreshIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChartPeriodSelector;
