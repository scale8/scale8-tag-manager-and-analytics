import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { QueryResult } from '@apollo/client/react/types/types';
import { Box, DialogContent, Divider, InputBase, MenuItem, Select } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import RefreshIcon from '@material-ui/icons/Refresh';
import { InfoButton, InfoProps } from '../components/molecules/InfoButton';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import InfoDialogTitle from '../components/molecules/InfoDialogTitle';
import {
    labelsFromRange,
    prepareUsageRange,
    UsageDetails,
    useStyles,
    zoomDefaultAggregateMinutes,
    zoomMaxAggregateMinutes,
    zoomMinAggregateMinutes,
} from '../utils/UsageUtils';

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
    const classes = useStyles();
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
                    yAxisID: 'y-axis-1',
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
                              yAxisID: 'y-axis-2',
                          },
                      ]),
            ],
        };

        const options = {
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: label1,
                        },
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    },
                    ...(label2 === undefined
                        ? []
                        : [
                              {
                                  scaleLabel: {
                                      display: true,
                                      labelString: label2,
                                  },
                                  type: 'linear',
                                  display: true,
                                  position: 'right',
                                  id: 'y-axis-2',
                                  gridLines: {
                                      drawOnArea: false,
                                  },
                              },
                          ]),
                ],
            },
        };

        return (
            <>
                <InfoDialogTitle fullscreen handleDialogClose={props.handleDialogClose}>
                    Usage
                    {formInfoProps !== undefined && <InfoButton {...formInfoProps} />}
                </InfoDialogTitle>
                <DialogContent
                    style={{
                        margin: 0,
                        padding: 0,
                    }}
                    dividers
                >
                    <Box display="flex" justifyContent="flex-end" mt={1} mr={5}>
                        <Select
                            className={classes.dropdown}
                            input={<InputBase />}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={aggregateMinutes}
                            onChange={(event: ChangeEvent<{ value: unknown }>) => {
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
                        <Divider className={classes.divider} orientation="vertical" flexItem />
                        {zoomLevels.map((zoomLevel) => (
                            <span
                                key={zoomLevel}
                                className={clsx(
                                    classes.zoomSelect,
                                    zoom === zoomLevel && classes.selected,
                                )}
                                onClick={() => setZoom(zoomLevel)}
                            >
                                {zoomLevel}
                            </span>
                        ))}
                        <Divider
                            style={{
                                marginLeft: '23px',
                            }}
                            className={classes.divider}
                            orientation="vertical"
                            flexItem
                        />
                        <RefreshIcon
                            className={classes.zoomSelect}
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
