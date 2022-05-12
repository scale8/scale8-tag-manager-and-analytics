import {
    ActionBaseValues,
    ActionFormProps,
    ActionValues,
} from '../../src/types/props/forms/ActionFormProps';
import { mockPlatformActions } from './MockPlatformActions';
import { mockAppPlatformRevisions } from './MockAppPlatformRevisions';
import { mockIngestEndpoints } from './MockIngestEndpoints';
import { buildActionCreateInput } from '../../src/dialogPages/tagManager/app/action/ActionCreate';
import { useFormWithMappedPlatformValues } from '../../src/hooks/form/useFormWithMappedPlatformValues';
import nameValidator from '../../src/utils/validators/nameValidator';
import { PlatformDataMap } from '../../src/types/DataMapsTypes';

export const useMockActionFormProps: () => ActionFormProps = () => {
    const formInitialState = {
        name: '',
        platformActionId: '',
        comments: '',
    };

    const availablePlatformActions = mockPlatformActions.defaultCase;
    const samplePlatformRevision = mockAppPlatformRevisions.defaultCase;
    const sampleIngestEndpoint = mockIngestEndpoints.defaultCase;

    const submitForm = async (actionValues: ActionValues) => {
        const actionCreateInput = buildActionCreateInput(
            actionValues.name,
            'actionId',
            actionValues.platformActionId,
            actionValues.mappedPlatformValues ?? [],
            '',
        );
        console.log({
            variables: { actionCreateInput },
        });
    };

    const formValidationValues = useFormWithMappedPlatformValues<ActionBaseValues>(
        formInitialState,
        [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Action name too short',
            },
        ],
        submitForm,
        availablePlatformActions.map((_) => ({
            id: _.id,
            platformDataMaps: _.platform_data_maps as PlatformDataMap[],
        })),
        'platformActionId',
    );

    return {
        ...formValidationValues,
        gqlError: undefined,
        submitText: 'Add Action',
        title: 'Add Action',
        handleDialogClose: () => {
            //no dialog
        },
        appPlatformRevisions: samplePlatformRevision,
        ingestEndpoints: sampleIngestEndpoint,
        environments: [
            { id: 'eeee1', name: 'Environment 1' },
            { id: 'eeee2', name: 'Environment 2' },
        ],
        revisions: [
            { id: 'rrr1', name: 'Revision 1' },
            { id: 'rrr2', name: 'Revision 2' },
        ],
        platformActions: availablePlatformActions.map((platformAction) => ({
            key: platformAction.id,
            text: platformAction.name,
        })),
        consentPurposes: [
            {
                id: 1,
                name: 'Store and/or access information on a device',
            },
            {
                id: 2,
                name: 'Select basic ads',
            },
        ],
        consentVendors: [
            {
                id: 1,
                name: 'Exponential Interactive, Inc d/b/a VDX.tv',
            },
            {
                id: 2,
                name: 'Captify Technologies Limited',
            },
            {
                id: 4,
                name: 'Roq.ad Inc.',
            },
        ],
    };
};
