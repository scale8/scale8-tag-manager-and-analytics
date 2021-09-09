import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { DataMapInput } from '../../../../gql/generated/globalTypes';
import EventForm from '../../../../components/organisms/Forms/EventForm';
import {
    mappedPlatformValuesFromDataMapsWithValues,
    mappedPlatformValuesToDataMapInput,
} from '../../../../utils/MappedPlatformValuesUtils';
import { FormWithMappedPlatformValuesResult } from '../../../../hooks/form/useFormWithMappedPlatformValues';
import nameValidator from '../../../../utils/validators/nameValidator';
import { CreateEventResult } from '../../../../gql/generated/CreateEventResult';
import { DataMap, PlatformDataMap } from '../../../../types/DataMapsTypes';
import { CustomBrowserEvent, PlatformEvent } from '../../../../types/TagRulesTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import UpdateEventGetQuery from '../../../../gql/queries/UpdateEventGetQuery';
import { UpdateEventGetData } from '../../../../gql/generated/UpdateEventGetData';
import { EventFormProps, EventValues } from './EventCreate';
import { MappedPlatformValues } from '../../../../types/MappedPlatformValuesTypes';
import UpdateEventQuery from '../../../../gql/mutations/UpdateEventQuery';
import { FormMutationData, SelectValueWithSub } from '../../../../hooks/form/useFormValidation';
import { UpdateEventResult } from '../../../../gql/generated/UpdateEventResult';
import { controlledSelectValuesFindByInnerKey } from '../../../../utils/ControlledSelectUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { getEventIcon } from '../../../../utils/TypeIconsUtils';
import { useConfigState } from '../../../../context/AppContext';

const getPlatformEventId = (formLoadedData: UpdateEventGetData): string =>
    (formLoadedData.getEvent.event as PlatformEvent).id ?? '';

const getPlatformId = (formLoadedData: UpdateEventGetData): string =>
    (formLoadedData.getEvent.event as PlatformEvent).platform?.id ?? '';

const customValueUsed = (formLoadedData: UpdateEventGetData): boolean =>
    (formLoadedData.getEvent.event as PlatformEvent).id === undefined;

const eventAsNameUsed = (formLoadedData: UpdateEventGetData): boolean =>
    customValueUsed(formLoadedData) &&
    formLoadedData.getEvent.name ===
        (formLoadedData.getEvent.event as CustomBrowserEvent).custom_name;

const getAvailableEvents = (formLoadedData: UpdateEventGetData): SelectValueWithSub[] =>
    formLoadedData.getTrigger.revision.app_platform_revisions.map((_) => ({
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
    }));

const buildEventName = (
    eventId: string | undefined,
    availableEvents: SelectValueWithSub[],
): string => {
    if (!eventId) {
        return '';
    }

    const selectedEvent = controlledSelectValuesFindByInnerKey(availableEvents, eventId);

    if (!selectedEvent) {
        return '';
    }

    return selectedEvent.text;
};

const builtNameUsed = (formLoadedData: UpdateEventGetData): boolean =>
    !customValueUsed(formLoadedData) &&
    formLoadedData.getEvent.name ===
        buildEventName(getPlatformEventId(formLoadedData), getAvailableEvents(formLoadedData));

const EventUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    const eventUpdateProps: DialogPreloadFormProps<
        UpdateEventGetData,
        EventValues,
        EventFormProps,
        CreateEventResult
    > = {
        loadQuery: useQuery<UpdateEventGetData>(UpdateEventGetQuery, {
            variables: { id: props.id, triggerId: props.contextId },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateEventGetData) => {
            if (customValueUsed(formLoadedData)) {
                return {
                    eventId: '',
                    browserEvent: (formLoadedData.getEvent.event as CustomBrowserEvent).custom_name,
                    name: formLoadedData.getEvent.name,
                    comments: '',
                    clearState: formLoadedData.getEvent.clear_state_ms,
                };
            } else {
                const mappedPlatformValues: MappedPlatformValues =
                    mappedPlatformValuesFromDataMapsWithValues(
                        (formLoadedData.getEvent.event as PlatformEvent)
                            .platform_data_maps as PlatformDataMap[],
                        formLoadedData.getEvent.data_maps as DataMap[],
                    );

                return {
                    eventId: getPlatformEventId(formLoadedData),
                    browserEvent: '',
                    name: formLoadedData.getEvent.name,
                    mappedPlatformValues,
                    comments: '',
                    clearState: formLoadedData.getEvent.clear_state_ms,
                };
            }
        },
        saveQuery: useMutation(UpdateEventQuery),
        mapSaveData: (eventValues: EventValues) => {
            const data_maps: DataMapInput[] = mappedPlatformValuesToDataMapInput(
                eventValues.mappedPlatformValues ?? [],
            );

            return {
                eventUpdateInput: {
                    event_id: props.id,
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
            formLoadedData: UpdateEventGetData,
            formValidationValues: FormWithMappedPlatformValuesResult<EventValues>,
            gqlError?: ApolloError,
        ): EventFormProps => ({
            ...formValidationValues,
            gqlError,
            initialPlatformId: getPlatformId(formLoadedData),
            useCustom: customValueUsed(formLoadedData),
            useEventAsName: eventAsNameUsed(formLoadedData),
            generateName: builtNameUsed(formLoadedData),
            update: true,
            submitText: 'Update Event',
            title: 'Update Event',
            formInfoProps: buildStandardFormInfo('events', 'Update'),
            handleDialogClose: props.handleDialogClose,
            availableEvents: getAvailableEvents(formLoadedData),
            consentPurposes,
            consentVendors,
        }),
        checkSuccessfullySubmitted: (
            formMutationData: FormMutationData | UpdateEventResult,
        ): boolean => !!formMutationData?.updateEvent,
        pageComponent: EventForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Event name too short',
            },
        ],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (formLoadedData: UpdateEventGetData) => {
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
            buildExistingModelData: (formLoadedData) => ({
                id: getPlatformEventId(formLoadedData),
                dataMaps: formLoadedData.getEvent.data_maps as DataMap[],
            }),
        },
        ...props,
    };

    return (
        <DialogPreloadForm<UpdateEventGetData, EventValues, EventFormProps, CreateEventResult>
            {...eventUpdateProps}
        />
    );
};

export { EventUpdate, buildEventName };
