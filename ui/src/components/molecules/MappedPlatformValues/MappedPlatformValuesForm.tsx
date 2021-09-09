import {
    MappedPlatformElement,
    MappedPlatformValues,
} from '../../../types/MappedPlatformValuesTypes';
import { Box } from '@material-ui/core';
import { MappedPlatformElementTypeSelect } from './MappedPlatformElementTypeSelect';
import { FormWithMappedPlatformValuesResult } from '../../../hooks/form/useFormWithMappedPlatformValues';
import { makeStyles } from '@material-ui/core/styles';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../types/IngestEndpointsTypes';
import { FC, Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
    description: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
        color: '#666666',
    },
}));

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
    const classes = useStyles();

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
                    <div className={classes.description}>
                        <small>{mappedPlatformElement.platformDataMap.description}</small>
                    </div>
                </Fragment>
            ))}
        </>
    );
};

export { MappedPlatformValuesForm };
