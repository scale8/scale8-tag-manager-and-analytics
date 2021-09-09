import { FC } from 'react';
import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import { MappedPlatformValuesDisplay } from '../molecules/MappedPlatformValues/MappedPlatformValuesDisplay';
import { buildPlatformDataMapPlatformElements } from '../../utils/PlatformDataMapsUtils';
import { Box } from '@material-ui/core';

export type TemplatedActionDataMapFormPreviewProps = {
    platformDataMaps: PlatformDataMapInput[];
};

const TemplatedActionDataMapFormPreview: FC<TemplatedActionDataMapFormPreviewProps> = (
    props: TemplatedActionDataMapFormPreviewProps,
) => {
    const { platformDataMaps } = props;

    return (
        <Box p={2} pb={4}>
            <MappedPlatformValuesDisplay
                mappedPlatformValues={buildPlatformDataMapPlatformElements(platformDataMaps)}
                // Just there for the preview, few sample values are enough
                consentPurposes={[
                    {
                        id: 1,
                        name: 'Store and/or access information on a device',
                    },
                    {
                        id: 2,
                        name: 'Select basic ads',
                    },
                ]}
                consentVendors={[
                    {
                        id: 1,
                        name: 'Exponential Interactive, Inc d/b/a VDX.tv',
                    },
                    {
                        id: 2,
                        name: 'Captify Technologies Limited',
                    },
                    {
                        id: 4,
                        name: 'Roq.ad Inc.',
                    },
                ]}
                parentLocators={[]}
            />
        </Box>
    );
};

export default TemplatedActionDataMapFormPreview;
