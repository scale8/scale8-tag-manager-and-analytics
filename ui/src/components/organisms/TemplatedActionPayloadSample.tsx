import { FC } from 'react';
import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import {
    buildPlatformDataMapPayload,
    buildPlatformDataMapSample,
} from '../../utils/PlatformDataMapsUtils';
import { Box } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LazyHighlight from '../atoms/LibraryLoaders/LazyHighlight';

const useStyles = makeStyles((theme) =>
    createStyles({
        sampleLabel: {
            padding: theme.spacing(1, 1, 0, 1),
            fontSize: '0.9em',
        },
        container: {
            padding: theme.spacing(1, 2),
            height: '100%',
            width: '100%',
            display: 'flex',
            flexFlow: 'column nowrap',
        },
        code: {
            '& pre': {
                margin: 0,
            },
        },
    }),
);

export type TemplatedActionDataMapPayloadSampleProps = {
    platformDataMaps: PlatformDataMapInput[];
};

const TemplatedActionPayloadSample: FC<TemplatedActionDataMapPayloadSampleProps> = (
    props: TemplatedActionDataMapPayloadSampleProps,
) => {
    const classes = useStyles();
    const { platformDataMaps } = props;

    return (
        <div className={classes.container}>
            <div className={classes.sampleLabel}>Payload Sample</div>
            <Box flex={1} position="relative">
                <Box
                    height="100%"
                    position="absolute"
                    width="100%"
                    overflow="auto"
                    fontSize={12}
                    fontWeight="bold"
                    bgcolor="#002b36"
                    border={1}
                    borderColor="#002b36"
                    className={classes.code}
                >
                    <LazyHighlight
                        language="json"
                        code={JSON.stringify(
                            buildPlatformDataMapSample(
                                buildPlatformDataMapPayload(platformDataMaps),
                            ),
                            null,
                            2,
                        )}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default TemplatedActionPayloadSample;
