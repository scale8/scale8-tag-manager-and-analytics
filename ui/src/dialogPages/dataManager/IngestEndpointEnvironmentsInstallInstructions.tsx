import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { IngestEndpointEnvironmentInstructionsGetData } from '../../gql/generated/IngestEndpointEnvironmentInstructionsGetData';
import IngestEndpointEnvironmentInstructionsGetQuery from '../../gql/queries/IngestEndpointEnvironmentInstructionsGetQuery';
import IngestEndpointInstallInstructions from '../../components/molecules/IngestEndpointInstallInstructions';
import { DataMapsPayload } from '../../components/organisms/DataMapsPayloadBuilder';
import DialogWithPayloadBuilder from '../../components/organisms/DialogWithPayloadBuilder';
import { IngestEndpointDataMap } from '../../types/IngestEndpointsTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { useConfigState } from '../../context/AppContext';

const IngestEndpointEnvironmentsInstallInstructions: FC<DialogPageProps> = (
    props: DialogPageProps,
) => {
    const [payload, setPayload] = useState<DataMapsPayload>(null);
    const { mode } = useConfigState();

    return QueryLoaderAndError<IngestEndpointEnvironmentInstructionsGetData>(
        false,
        useQuery<IngestEndpointEnvironmentInstructionsGetData>(
            IngestEndpointEnvironmentInstructionsGetQuery,
            {
                variables: { id: props.id },
            },
        ),
        (data: IngestEndpointEnvironmentInstructionsGetData) => {
            return (
                <DialogWithPayloadBuilder
                    handleDialogClose={props.handleDialogClose}
                    dataMaps={
                        (data.getIngestEndpointEnvironment.ingest_endpoint_revision
                            ?.ingest_endpoint_data_maps ?? []) as IngestEndpointDataMap[]
                    }
                    payload={payload}
                    setPayload={setPayload}
                    finalStepLabel="Install / Use Environment"
                >
                    <IngestEndpointInstallInstructions
                        installDomain={data.getIngestEndpointEnvironment.install_domain}
                        cname={data.getIngestEndpointEnvironment.cname}
                        mode={mode}
                        environmentId={data.getIngestEndpointEnvironment.id}
                        payload={payload}
                    />
                </DialogWithPayloadBuilder>
            );
        },
    );
};

export default IngestEndpointEnvironmentsInstallInstructions;
