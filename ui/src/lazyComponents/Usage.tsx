import { ReactElement, useEffect, useState } from 'react';
import { QueryResult } from '@apollo/client/react/types/types';
import {
    Box,
    DialogContent,
    Divider,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import RefreshIcon from '@mui/icons-material/Refresh';
import { InfoButton, InfoProps } from '../components/molecules/InfoButton';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import InfoDialogTitle from '../components/molecules/InfoDialogTitle';
import {
    labelsFromRange,
    prepareUsageRange,
    UsageDetails,
    zoomDefaultAggregateMinutes,
    zoomMaxAggregateMinutes,
    zoomMinAggregateMinutes,
} from '../utils/UsageUtils';
import { ChartOptions } from 'chart.js';

export type UsagePageProps = { sourceId: string };

export type UsageProps<UsageData> = UsagePageProps & {
    mainQuery: QueryResult<UsageData>;
    extractUsage: (data: UsageData) => UsageDetails[];
    label1: string;
    label2?: string;
    formInfoProps?: InfoProps;
    handleDialogClose: (checkChanges: boolean) => void;
};

const Usage = <UsageData extends Record<string, any>>(
    props: UsageProps<UsageData>,
): ReactElement => {
    const [zoom, setZoom] = useState('1h');
    const [aggregateMinutes, setAggregateMinutes] = useState(1);
    const zoomLevels = ['1h', '2h', '12h', '1d', '3d', '1w', '2w'];
    const aggregateValues = [
        { value: 1, display: '1 Minute' },
        { value: 5, display: '5 Minutes' },
        { value: 15, display: '15 Minutes' },
        { value: 60, display: '1 Hour' },
        { value: 360, display: '6 Hours' },
        { value: 720, display: '12 Hours' },
        { value: 1440, display: '1 Day' },
    ];

    const { mainQuery, extractUsage, label1, label2, formInfoProps } = props;

    useEffect(() => {
        setAggregateMinutes(zoomDefaultAggregateMinutes(zoom));
    }, [zoom]);

    return queryLoaderAndError<UsageData>(false, mainQuery, (queryData: UsageData) => {
        const usageRange = prepareUsageRange(extractUsage(queryData), zoom, aggregateMinutes);

        const data = {
            labels: labelsFromRange(usageRange, aggregateMinutes),
            datasets: [
                {
                    label: label1,
                    data: usageRange.map((_) => _.field1),
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'yAxis1',
                },
                ...(label2 === undefined
                    ? []
                    : [
                          {
                              label: label2,
                              data: usageRange.map((_) => _.field2),
                              fill: false,
                              backgroundColor: 'rgb(150, 200, 150)',
                              borderColor: 'rgba(150, 200, 150, 0.2)',
                              yAxisID: 'yAxis2',
                          },
                      ]),
            ],
        };

        const options: ChartOptions<'line'> = {
            maintainAspectRatio: false,
            scales: {
                xAxis: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },

                yAxis1: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: label1,
                    },
                    display: true,
                    position: 'left',
                },
                ...(label2 === undefined
                    ? {}
                    : {
                          yAxis2: {
                              type: 'linear',
                              title: {
                                  display: true,
                                  text: label2,
                              },
                              display: true,
                              position: 'right',
                          },
                      }),
            },
        };

        return (
            <>
                <InfoDialogTitle fullscreen handleDialogClose={props.handleDialogClose}>
                    Usage
                    {formInfoProps !== undefined && <InfoButton {...formInfoProps} />}
                </InfoDialogTitle>
                <DialogContent
                    sx={{
                        margin: 0,
                        padding: 0,
                    }}
                    dividers
                >
                    <Box display="flex" justifyContent="flex-end" mt={1} mr={5}>
                        <Select
                            sx={{
                                marginTop: '-4px',
                                '& .MuiSelect-select:focus': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                            input={<InputBase />}
                            id="demo-simple-select"
                            value={aggregateMinutes}
                            onChange={(event: SelectChangeEvent<number>) => {
                                setAggregateMinutes(event.target.value as number);
                            }}
                        >
                            {[...aggregateValues]
                                .sort((a, b) => (a.display > b.display ? 1 : -1))
                                .map((_) => (
                                    <MenuItem
                                        key={_.value}
                                        value={_.value}
                                        disabled={
                                            _.value < zoomMinAggregateMinutes(zoom) ||
                                            _.value > zoomMaxAggregateMinutes(zoom)
                                        }
                                    >
                                        {_.display}
                                    </MenuItem>
                                ))}
                        </Select>
                        <Divider
                            sx={{
                                height: '20px',
                                marginTop: '2px',
                                marginLeft: '13px',
                            }}
                            orientation="vertical"
                            flexItem
                        />
                        {zoomLevels.map((zoomLevel) => (
                            <Box
                                component="span"
                                key={zoomLevel}
                                sx={{
                                    fontWeight: 'bold',
                                    marginLeft: '20px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: '#40a9ff',
                                        opacity: 1,
                                    },
                                    '&.selected': {
                                        color: '#1890ff',
                                        cursor: 'default',
                                    },
                                    '&:focus': {
                                        color: '#40a9ff',
                                    },
                                }}
                                className={zoom === zoomLevel ? 'selected' : undefined}
                                onClick={() => setZoom(zoomLevel)}
                            >
                                {zoomLevel}
                            </Box>
                        ))}
                        <Divider
                            sx={{
                                height: '20px',
                                marginTop: '2px',
                                marginLeft: '23px',
                            }}
                            orientation="vertical"
                            flexItem
                        />
                        <RefreshIcon
                            sx={{
                                fontWeight: 'bold',
                                marginLeft: '20px',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#40a9ff',
                                    opacity: 1,
                                },
                                '&:focus': {
                                    color: '#40a9ff',
                                },
                            }}
                            onClick={() => {
                                (async () => {
                                    await mainQuery.refetch();
                                })();
                            }}
                        />
                    </Box>
                    <Box position="absolute" bottom={25} left={25} right={25} top={125}>
                        <Line data={data} options={options} />
                    </Box>
                </DialogContent>
            </>
        );
    });
};

export { Usage };
