import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import IngestEndpointRevisionPayloadPreviewGetQuery from '../../gql/queries/IngestEndpointRevisionPayloadPreviewGetQuery';
import { IngestEndpointRevisionPayloadPreviewGetData } from '../../gql/generated/IngestEndpointRevisionPayloadPreviewGetData';
import DialogWithPayloadBuilder from '../../components/organisms/DialogWithPayloadBuilder';
import { DataMapsPayload } from '../../components/organisms/DataMapsPayloadBuilder';
import CopyBlock from '../../components/atoms/CopyBlock';
import { IngestEndpointDataMap } from '../../types/IngestEndpointsTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';

const IngestEndpointRevisionPayloadPreview: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [payload, setPayload] = useState<DataMapsPayload>(null);

    return queryLoaderAndError<IngestEndpointRevisionPayloadPreviewGetData>(
        false,
        useQuery<IngestEndpointRevisionPayloadPreviewGetData>(
            IngestEndpointRevisionPayloadPreviewGetQuery,
            {
                variables: { id: props.id },
            },
        ),
        (data: IngestEndpointRevisionPayloadPreviewGetData) => {
            return (
                <DialogWithPayloadBuilder
                    handleDialogClose={props.handleDialogClose}
                    dataMaps={
                        data.getIngestEndpointRevision
                            .ingest_endpoint_data_maps as IngestEndpointDataMap[]
                    }
                    payload={payload}
                    setPayload={setPayload}
                    finalStepLabel="Preview Payload"
                >
                    <CopyBlock text={JSON.stringify(payload, null, 2)} language="html" />
                </DialogWithPayloadBuilder>
            );
        },
    );
};

export { IngestEndpointRevisionPayloadPreview };
