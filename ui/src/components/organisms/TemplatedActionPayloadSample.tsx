import { FC } from 'react';
import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import {
    buildPlatformDataMapPayload,
    buildPlatformDataMapSample,
} from '../../utils/PlatformDataMapsUtils';
import { Box } from '@mui/material';
import LazyShiki from '../atoms/LibraryLoaders/LazyShiki';

export type TemplatedActionDataMapPayloadSampleProps = {
    platformDataMaps: PlatformDataMapInput[];
};

const TemplatedActionPayloadSample: FC<TemplatedActionDataMapPayloadSampleProps> = (
    props: TemplatedActionDataMapPayloadSampleProps,
) => {
    const { platformDataMaps } = props;

    return (
        <Box
            sx={{
                padding: (theme) => theme.spacing(1, 2),
                height: '100%',
                width: '100%',
                display: 'flex',
                flexFlow: 'column nowrap',
            }}
        >
            <Box
                sx={{
                    padding: (theme) => theme.spacing(1, 1, 0, 1),
                    fontSize: '0.9em',
                }}
            >
                Payload Sample
            </Box>
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
                    sx={{
                        '& pre': {
                            margin: 0,
                        },
                    }}
                >
                    <LazyShiki
                        language="json"
                        code={JSON.stringify(
                            buildPlatformDataMapSample(
                                buildPlatformDataMapPayload(platformDataMaps),
                            ),
                            null,
                            2,
                        )}
                        smallText
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatedActionPayloadSample;
