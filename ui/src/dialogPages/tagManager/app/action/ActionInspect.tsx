import { FC } from 'react';
import InspectActionDialog from '../../../../components/organisms/InspectActionDialog';
import { useQuery } from '@apollo/client';
import InspectActionQuery from '../../../../gql/queries/InspectActionQuery';
import { InspectActionData } from '../../../../gql/generated/InspectActionData';
import { MappedPlatformValues } from '../../../../types/MappedPlatformValuesTypes';
import { DataMap, PlatformDataMap } from '../../../../types/DataMapsTypes';
import { mappedPlatformValuesFromDataMapsWithValues } from '../../../../utils/MappedPlatformValuesUtils';
import { AppPlatformRevision } from '../../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../../types/IngestEndpointsTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { QueryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';
import { useConfigState } from '../../../../context/AppContext';

const ActionInspect: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { id } = props;

    const { consentPurposes, consentVendors } = useConfigState();

    const handleClose = () => {
        props.handleDialogClose(false);
    };

    return QueryLoaderAndError<InspectActionData>(
        false,
        useQuery<InspectActionData>(InspectActionQuery, {
            variables: { id, agdId: props.contextId },
        }),
        (data: InspectActionData) => {
            const platformData: MappedPlatformValues = mappedPlatformValuesFromDataMapsWithValues(
                data.getAction.platform_action.platform_data_maps as PlatformDataMap[],
                data.getAction.data_maps as DataMap[],
            );

            return (
                <InspectActionDialog
                    appPlatformRevisions={
                        data.getActionGroupDistribution.revision
                            .app_platform_revisions as AppPlatformRevision[]
                    }
                    ingestEndpoints={
                        data.getActionGroupDistribution.revision.app.tag_manager_account.org
                            .data_manager_account
                            .ingest_endpoints as IngestEndpointForEnvironmentSelection[]
                    }
                    environments={data.getActionGroupDistribution.revision.app.environments}
                    revisions={data.getActionGroupDistribution.revision.app.revisions}
                    consentPurposes={consentPurposes}
                    consentVendors={consentVendors}
                    platformData={platformData}
                    name={data.getAction.name}
                    handleClose={handleClose}
                />
            );
        },
    );
};

export default ActionInspect;
