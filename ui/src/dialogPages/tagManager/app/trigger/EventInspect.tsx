import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { MappedPlatformValues } from '../../../../types/MappedPlatformValuesTypes';
import { DataMap, PlatformDataMap } from '../../../../types/DataMapsTypes';
import {
    InspectEventData,
    InspectEventData_getEvent_event_CustomEvent,
    InspectEventData_getEvent_event_PlatformEvent,
} from '../../../../gql/generated/InspectEventData';
import InspectEventDialog from '../../../../components/organisms/InspectEventDialog';
import { mappedPlatformValuesFromDataMapsWithValues } from '../../../../utils/MappedPlatformValuesUtils';
import { DialogPageProps } from '../../../../types/DialogTypes';
import InspectEventQuery from '../../../../gql/queries/InspectEventQuery';
import { QueryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';
import { useConfigState } from '../../../../context/AppContext';

const EventInspect: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { id } = props;

    const { consentPurposes, consentVendors } = useConfigState();

    const handleClose = () => {
        props.handleDialogClose(true);
    };

    return QueryLoaderAndError<InspectEventData>(
        false,
        useQuery<InspectEventData>(InspectEventQuery, {
            variables: { id },
        }),
        (data: InspectEventData) => {
            if (
                (data.getEvent.event as InspectEventData_getEvent_event_PlatformEvent).id !==
                undefined
            ) {
                const platformData: MappedPlatformValues =
                    mappedPlatformValuesFromDataMapsWithValues(
                        (data.getEvent.event as InspectEventData_getEvent_event_PlatformEvent)
                            .platform_data_maps as PlatformDataMap[],
                        data.getEvent.data_maps as DataMap[],
                    );

                return (
                    <InspectEventDialog
                        platformData={platformData}
                        platform={
                            (data.getEvent.event as InspectEventData_getEvent_event_PlatformEvent)
                                .platform.name
                        }
                        event={
                            (data.getEvent.event as InspectEventData_getEvent_event_PlatformEvent)
                                .name
                        }
                        eventDescription={
                            (data.getEvent.event as InspectEventData_getEvent_event_PlatformEvent)
                                .description
                        }
                        clearState={data.getEvent.clear_state_ms}
                        consentPurposes={consentPurposes}
                        consentVendors={consentVendors}
                        name={data.getEvent.name}
                        handleClose={handleClose}
                    />
                );
            } else {
                return (
                    <InspectEventDialog
                        platformData={[]}
                        customEvent={
                            (data.getEvent.event as InspectEventData_getEvent_event_CustomEvent)
                                .custom_name
                        }
                        clearState={data.getEvent.clear_state_ms}
                        consentPurposes={consentPurposes}
                        consentVendors={consentVendors}
                        name={data.getEvent.name}
                        handleClose={handleClose}
                    />
                );
            }
        },
    );
};

export default EventInspect;
