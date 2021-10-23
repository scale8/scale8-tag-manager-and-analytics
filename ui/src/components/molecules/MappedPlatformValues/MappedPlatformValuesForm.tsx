import {
    MappedPlatformElement,
    MappedPlatformValues,
} from '../../../types/MappedPlatformValuesTypes';
import { Box } from '@mui/material';
import { MappedPlatformElementTypeSelect } from './MappedPlatformElementTypeSelect';
import { FormWithMappedPlatformValuesResult } from '../../../hooks/form/useFormWithMappedPlatformValues';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../types/IngestEndpointsTypes';
import { FC, Fragment } from 'react';

export type MappedPlatformValuesFormProps = FormWithMappedPlatformValuesResult<any> & {
    mappedPlatformValues: MappedPlatformValues;
    appPlatformRevisions?: AppPlatformRevision[];
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    environments?: { id: string; name: string }[];
    revisions?: { id: string; name: string }[];
    consentPurposes?: { id: number; name: string }[];
    consentVendors?: { id: number; name: string }[];
    parentLocators: { id: string; index: number }[];
    disabled?: boolean;
};

export type MappedPlatformElementFormProps = FormWithMappedPlatformValuesResult<any> & {
    mappedPlatformElement: MappedPlatformElement;
    disabled: boolean;
    parentLocators: { id: string; index: number }[];
};

const MappedPlatformValuesForm: FC<MappedPlatformValuesFormProps> = (
    props: MappedPlatformValuesFormProps,
) => {
    const { mappedPlatformValues, parentLocators, disabled, ...formProps } = props;

    return (
        <>
            {mappedPlatformValues.map((mappedPlatformElement, key) => (
                <Fragment key={key}>
                    {key !== 0 && <Box width="100%" mt={1} />}
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
                        formProps={formProps}
                        readOnly={!!disabled}
                    />
                    <Box
                        sx={{
                            width: '100%',
                            margin: (theme) => theme.spacing(0, 0, 3),
                            color: '#666666',
                        }}
                    >
                        <small>{mappedPlatformElement.platformDataMap.description}</small>
                    </Box>
                </Fragment>
            ))}
        </>
    );
};

export { MappedPlatformValuesForm };
