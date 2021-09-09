import { FC, Fragment } from 'react';
import { MappedPlatformValues } from '../../../types/MappedPlatformValuesTypes';
import { MappedPlatformElementTypeSelect } from './MappedPlatformElementTypeSelect';
import { Box } from '@material-ui/core';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../types/IngestEndpointsTypes';

export type MappedPlatformValuesDisplayProps = {
    appPlatformRevisions?: AppPlatformRevision[];
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    environments?: { id: string; name: string }[];
    revisions?: { id: string; name: string }[];
    consentPurposes?: { id: number; name: string }[];
    consentVendors?: { id: number; name: string }[];
    mappedPlatformValues: MappedPlatformValues;
    parentLocators: { id: string; index: number }[];
};

const MappedPlatformValuesDisplay: FC<MappedPlatformValuesDisplayProps> = (
    props: MappedPlatformValuesDisplayProps,
) => {
    const { mappedPlatformValues, parentLocators } = props;

    return (
        <>
            {mappedPlatformValues.map((mappedPlatformElement, key) => (
                <Fragment key={key}>
                    {key !== 0 && <Box width="100%" mt={3} />}
                    <MappedPlatformElementTypeSelect
                        appPlatformRevisions={props.appPlatformRevisions}
                        ingestEndpoints={props.ingestEndpoints}
                        revisions={props.revisions}
                        environments={props.environments}
                        consentPurposes={props.consentPurposes}
                        consentVendors={props.consentVendors}
                        key={mappedPlatformElement.platformDataMap.id}
                        mappedPlatformElement={mappedPlatformElement}
                        parentLocators={parentLocators}
                        readOnly={true}
                    />
                </Fragment>
            ))}
        </>
    );
};

export { MappedPlatformValuesDisplay };
