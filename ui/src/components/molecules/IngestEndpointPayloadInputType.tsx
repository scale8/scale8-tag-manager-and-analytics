import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DataMapsPayloadValues } from '../../types/DataMapsTypes';
import SelectInput from '../atoms/InputTypes/SelectInput';
import { DataMapsPayload, DataMapsPayloadBuilder } from '../organisms/DataMapsPayloadBuilder';
import {
    IngestEndpointEnvironment,
    IngestEndpointForEnvironmentSelection,
} from '../../types/IngestEndpointsTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import makeStyles from '@mui/styles/makeStyles';
import { Box, useTheme } from '@mui/material';
import { SelectValueWithSub } from '../../hooks/form/useFormValidation';

const useStyles = makeStyles((theme) => ({
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
}));

type SelectIngestEndpointProps = {
    ingestEndpointId: string;
    setIngestEndpointId: Dispatch<SetStateAction<string>>;
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    disabled: boolean;
};

const SelectIngestEndpoint: FC<SelectIngestEndpointProps> = (props: SelectIngestEndpointProps) => {
    const classes = useStyles();

    const ingestEndpointSelectOptions: SelectValueWithSub[] =
        props.ingestEndpoints === undefined
            ? []
            : props.ingestEndpoints.map((_) => ({
                  key: _.id,
                  text: _.name,
              }));

    if (ingestEndpointSelectOptions.length === 0) {
        return (
            <small className={classes.input}>
                There are no endpoints defined in this Organization.
            </small>
        );
    }

    return (
        <SelectInput
            name="ingestEndpoint"
            label="Ingest Endpoint"
            value={props.ingestEndpointId}
            setValue={(v) => props.setIngestEndpointId(v)}
            optionValues={[]}
            keyTextValues={ingestEndpointSelectOptions}
            className={classes.input}
            disabled={props.disabled}
            required
        />
    );
};

const findAvailableEnvironments = (
    ingestEndpointId: string,
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[],
): IngestEndpointEnvironment[] => {
    const currentEndpointData: IngestEndpointForEnvironmentSelection | undefined =
        ingestEndpoints?.find((_) => _.id === ingestEndpointId);

    return currentEndpointData === undefined
        ? []
        : currentEndpointData.ingest_endpoint_environments;
};

type SelectIngestEndpointEnvironmentProps = {
    ingestEndpointId: string;
    environmentId: string;
    setEnvironmentId: Dispatch<SetStateAction<string>>;
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    disabled: boolean;
};

const SelectIngestEndpointEnvironment: FC<SelectIngestEndpointEnvironmentProps> = (
    props: SelectIngestEndpointEnvironmentProps,
) => {
    const classes = useStyles();

    const availableEnvironments = findAvailableEnvironments(
        props.ingestEndpointId,
        props.ingestEndpoints,
    );

    if (props.ingestEndpointId === '') {
        return null;
    }

    if (availableEnvironments.length === 0) {
        return (
            <small className={classes.input}>
                There are no environments defined for this endpoint.
            </small>
        );
    }

    return (
        <SelectInput
            name="ingestEnvironment"
            label="Ingest Endpoint Environment"
            value={props.environmentId}
            setValue={(v) => props.setEnvironmentId(v)}
            optionValues={[]}
            keyTextValues={availableEnvironments.map((_) => ({
                key: _.id,
                text: _.name,
            }))}
            className={classes.input}
            disabled={props.disabled}
            required
        />
    );
};

const findIngestEndpointEnvironment = (
    environmentId: string,
    ingestEndpointId: string,
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[],
): IngestEndpointEnvironment | undefined => {
    const availableEnvironments = findAvailableEnvironments(ingestEndpointId, ingestEndpoints);

    return availableEnvironments.find((_) => _.id === environmentId);
};

const findIngestEndpointId = (
    environmentId: string,
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[],
): string => {
    if (ingestEndpoints === undefined || environmentId === '') {
        return '';
    }

    const foundEndpoint: IngestEndpointForEnvironmentSelection | undefined = ingestEndpoints.find(
        (ingestEndpoint: IngestEndpointForEnvironmentSelection) => {
            return (
                ingestEndpoint.ingest_endpoint_environments.find((_) => _.id === environmentId) !==
                undefined
            );
        },
    );

    return foundEndpoint === undefined ? '' : foundEndpoint.id;
};

export type IngestEndpointPayloadInputTypeProps = {
    value: S8DataMapValue;
    disabled: boolean;
    setValue: (v: S8DataMapValue, index: number) => void;
    appPlatformRevisions?: AppPlatformRevision[];
    validationError?: string;
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
};

const IngestEndpointPayloadInputType: FC<IngestEndpointPayloadInputTypeProps> = (
    props: IngestEndpointPayloadInputTypeProps,
) => {
    const theme = useTheme();

    const { value, setValue, ingestEndpoints, appPlatformRevisions } = props;

    const { ingest_environment_id: initialEnvironmentId, payload: initialPayload } =
        value === ''
            ? {
                  ingest_environment_id: '',
                  payload: null,
              }
            : JSON.parse(value.toString());

    const [ingestEndpointId, setIngestEndpointId] = useState(
        findIngestEndpointId(initialEnvironmentId, ingestEndpoints),
    );
    const [environmentId, setEnvironmentId] = useState(initialEnvironmentId);
    const [payload, setPayload] = useState<DataMapsPayload>(initialPayload);

    const [dataMapsPayloadValues, setDataMapsPayloadValues] = useState<DataMapsPayloadValues[]>([]);

    useEffect(() => {
        if (payload !== null) {
            setValue(
                JSON.stringify({
                    ingest_environment_id: environmentId,
                    payload,
                }),
                0,
            );
        } else {
            setValue('', 0);
        }
    }, [environmentId, payload]);

    const ingestEndpointEnvironment: IngestEndpointEnvironment | undefined = useMemo(
        () => findIngestEndpointEnvironment(environmentId, ingestEndpointId, ingestEndpoints),
        [environmentId, ingestEndpointId, ingestEndpoints],
    );

    return (
        <>
            <SelectIngestEndpoint
                ingestEndpointId={ingestEndpointId}
                setIngestEndpointId={setIngestEndpointId}
                ingestEndpoints={ingestEndpoints}
                disabled={props.disabled}
            />
            <SelectIngestEndpointEnvironment
                ingestEndpointId={ingestEndpointId}
                environmentId={environmentId}
                setEnvironmentId={setEnvironmentId}
                ingestEndpoints={ingestEndpoints}
                disabled={props.disabled}
            />
            {ingestEndpointEnvironment !== undefined && (
                <DataMapsPayloadBuilder
                    appPlatformRevisions={appPlatformRevisions}
                    initialPayload={initialPayload}
                    setPayload={setPayload}
                    dataMaps={
                        ingestEndpointEnvironment.ingest_endpoint_revision.ingest_endpoint_data_maps
                    }
                    dataMapsPayloadValues={dataMapsPayloadValues}
                    setDataMapsPayloadValues={setDataMapsPayloadValues}
                    disabled={props.disabled}
                />
            )}

            {props.validationError !== undefined && (
                <Box fontWeight={600} mb="3px" color={theme.palette.error.main}>
                    Please specify all the checked values
                </Box>
            )}
        </>
    );
};

export default IngestEndpointPayloadInputType;
