import { ValuesWithMappedPlatformData } from '../../MappedPlatformValuesTypes';
import { FormWithMappedPlatformValuesResult } from '../../../hooks/form/useFormWithMappedPlatformValues';
import { AppPlatformRevision } from '../../TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../IngestEndpointsTypes';
import { FormBaseProps } from './CommonFormProps';

export type ActionBaseValues = {
    name: string;
    platformActionId: string;
    comments: string;
};
export type ActionValues = ValuesWithMappedPlatformData<ActionBaseValues>;
export type ActionFormProps = FormWithMappedPlatformValuesResult<ActionValues> &
    FormBaseProps & {
        update?: boolean;
        generateName?: boolean;
        initialPlatformId?: string;
        appPlatformRevisions?: AppPlatformRevision[];
        ingestEndpoints: IngestEndpointForEnvironmentSelection[];
        platformActions: { key: string; text: string }[];
        environments: { id: string; name: string }[];
        revisions: { id: string; name: string }[];
        consentPurposes: { id: number; name: string }[];
        consentVendors: { id: number; name: string }[];
    };
