// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import ActionForm from '../components/organisms/Forms/ActionForm';
import { useFormWithMappedPlatformValues } from '../hooks/form/useFormWithMappedPlatformValues';
import nameValidator from '../utils/validators/nameValidator';
import { PlatformDataMap } from '../types/DataMapsTypes';
import CopyBlock from '../components/atoms/CopyBlock';
import {
    ActionBaseValues,
    ActionFormProps,
    ActionValues,
} from '../types/props/forms/ActionFormProps';
import Head from 'next/head';
import { mockPlatformActions } from './mock/MockPlatformActions';
import { mockAppPlatformRevisions } from './mock/MockAppPlatformRevisions';
import { mockIngestEndpoints } from './mock/MockIngestEndpoints';
import { buildActionCreateInput } from '../dialogPages/tagManager/app/action/ActionCreate';
import { SxBox } from '../components/atoms/SxBox';

const formInitialState = {
    name: '',
    platformActionId: '',
    comments: '',
};

const availablePlatformActions = mockPlatformActions.defaultCase;
const samplePlatformRevision = mockAppPlatformRevisions.defaultCase;
const sampleIngestEndpoint = mockIngestEndpoints.defaultCase;

const ActionFormTester: FC = () => {
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

    const formProps: ActionFormProps = {
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

    return (
        <>
            <Head>
                <title>Scale8 - Action Form Test</title>
                <meta name="description" content="Scale8 - Action Form Test." />
            </Head>

            <SxBox
                sx={{
                    display: 'flex',
                }}
            >
                <SxBox
                    sx={{
                        flex: 1,
                        p: 3,
                        borderRight: '1px solid black',
                        minHeight: '100vh',
                    }}
                >
                    <ActionForm {...formProps} />
                </SxBox>
                <SxBox
                    sx={{
                        flex: 1,
                        p: 3,
                    }}
                >
                    <CopyBlock
                        text={JSON.stringify(formProps.values.mappedPlatformValues ?? [], null, 2)}
                        language="json"
                    />
                </SxBox>
            </SxBox>
        </>
    );
};

export default ActionFormTester;
