import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateEventQuery from '../../../../gql/mutations/CreateEventQuery';
import { DataMapInput } from '../../../../gql/generated/globalTypes';
import EventForm from '../../../../components/organisms/Forms/EventForm';
import FetchAvailableEventsQuery from '../../../../gql/queries/FetchAvailableEventsQuery';
import { mappedPlatformValuesToDataMapInput } from '../../../../utils/MappedPlatformValuesUtils';
import { FormWithMappedPlatformValuesResult } from '../../../../hooks/form/useFormWithMappedPlatformValues';
import { SelectValueWithSub } from '../../../../hooks/form/useFormValidation';
import nameValidator from '../../../../utils/validators/nameValidator';
import { ValuesWithMappedPlatformData } from '../../../../types/MappedPlatformValuesTypes';
import { CreateEventResult } from '../../../../gql/generated/CreateEventResult';
import { PlatformDataMap } from '../../../../types/DataMapsTypes';
import { PlatformEvent } from '../../../../types/TagRulesTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { FetchAvailableEvents } from '../../../../gql/generated/FetchAvailableEvents';
import { FormBaseProps } from '../../../../types/props/forms/CommonFormProps';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { getEventIcon } from '../../../../utils/TypeIconsUtils';
import { useConfigState } from '../../../../context/AppContext';

export type EventBaseValues = {
    eventId: string;
    browserEvent: string;
    comments: string;
    name: string;
    clearState: number;
};

export type EventValues = ValuesWithMappedPlatformData<EventBaseValues>;

export type EventFormProps = FormWithMappedPlatformValuesResult<EventValues> &
    FormBaseProps & {
        update?: boolean;
        useCustom?: boolean;
        useEventAsName?: boolean;
        generateName?: boolean;
        initialPlatformId?: string;
        availableEvents: SelectValueWithSub[];
        consentPurposes: { id: number; name: string }[];
        consentVendors: { id: number; name: string }[];
    };

const EventCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    const eventCreateProps: DialogPreloadFormProps<
        FetchAvailableEvents,
        EventValues,
        EventFormProps,
        CreateEventResult
    > = {
        loadQuery: useQuery<FetchAvailableEvents>(FetchAvailableEventsQuery, {
            variables: { triggerId: props.id },
        }),
        buildInitialStatePreload: () => ({
            eventId: '',
            browserEvent: '',
            name: '',
            comments: '',
            clearState: -1,
        }),
        saveQuery: useMutation(CreateEventQuery),
        mapSaveData: (eventValues: EventValues) => {
            const data_maps: DataMapInput[] = mappedPlatformValuesToDataMapInput(
                eventValues.mappedPlatformValues ?? [],
            );

            return {
                eventCreateInput: {
                    trigger_id: props.id,
                    platform_event_id: eventValues.eventId === '' ? undefined : eventValues.eventId,
                    browser_event:
                        eventValues.browserEvent === '' ? undefined : eventValues.browserEvent,
                    name: eventValues.name,
                    clear_state_ms: eventValues.clearState,
                    data_maps,
                    ...(eventValues.comments === ''
                        ? {}
                        : {
                              comments: eventValues.comments,
                          }),
                },
            };
        },
        buildFormProps: (
            formLoadedData: FetchAvailableEvents,
            formValidationValues: FormWithMappedPlatformValuesResult<EventValues>,
            gqlError?: ApolloError,
        ): EventFormProps => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Add Event',
            title: 'Add Event',
            formInfoProps: buildStandardFormInfo('events', 'Create'),
            handleDialogClose: props.handleDialogClose,
            availableEvents: formLoadedData.getTrigger.revision.app_platform_revisions.map((_) => ({
                key: _.platform_revision.platform.id,
                text: _.platform_revision.platform.name,
                sub: _.platform_revision.platform_events.map((e) => {
                    const Icon = getEventIcon(e.icon);

                    return {
                        key: e.id,
                        text: e.name,
                        iconType: e.icon,
                        icon: <Icon />,
                        description: e.description,
                    };
                }) as SelectValueWithSub[],
            })),
            consentPurposes,
            consentVendors,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createEvent.id !== undefined,
        pageComponent: EventForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Event name too short',
            },
        ],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (formLoadedData: FetchAvailableEvents) => {
                const availableEvents =
                    formLoadedData.getTrigger.revision.app_platform_revisions.reduce(
                        (accumulator, currentValue) => {
                            return [
                                ...accumulator,
                                ...(currentValue.platform_revision
                                    .platform_events as PlatformEvent[]),
                            ];
                        },
                        [] as PlatformEvent[],
                    );
                return availableEvents.map((_) => ({
                    id: _.id,
                    platformDataMaps: _.platform_data_maps as PlatformDataMap[],
                }));
            },
            idValueForModelWithPlatformDataMaps: 'eventId',
        },
        ...props,
    };

    return (
        <DialogPreloadForm<FetchAvailableEvents, EventValues, EventFormProps, CreateEventResult>
            {...eventCreateProps}
        />
    );
};

export default EventCreate;
