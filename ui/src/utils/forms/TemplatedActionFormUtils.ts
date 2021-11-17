import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import { PlatformActionPermissionInput } from '../../types/ActionPermissionsTypes';
import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';
import descriptionValidator from '../validators/descriptionValidator';
import requiredStringValidator from '../validators/requiredStringValidator';
import parsedCodeValidator from '../validators/parsedCodeValidator';
import { PlatformActionPermissionRequest } from '../../gql/generated/globalTypes';

export type TemplatedActionsValues = {
    name: string;
    description: string;
    icon: string;
    code: string;
    execRaw: boolean;
    platformDataMaps: PlatformDataMapInput[];
    permissionRequests: PlatformActionPermissionInput[];
};

const TemplatedActionValidators: ValidateConfiguration<TemplatedActionsValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Action name too short',
    },
    {
        field: 'description',
        validator: descriptionValidator,
        error: () => 'Description too short',
    },
    {
        field: 'name',
        validator: requiredStringValidator,
        error: () => 'Required value',
    },
    {
        field: 'code',
        validator: parsedCodeValidator,
        error: (result) => `Invalid Code${result === 0 || `, Error: ${result}`}`,
    },
    {
        field: 'code',
        validator: async (
            value: string | boolean | PlatformActionPermissionInput[] | PlatformDataMapInput[],
        ): Promise<-1 | 0> => {
            return (value as string).includes('success()') ? -1 : 0;
        },
        error: () => 'Action code must invoke "success()"',
    },
    {
        field: 'icon',
        validator: requiredStringValidator,
        error: () => 'Required value',
    },
    {
        field: 'description',
        validator: requiredStringValidator,
        error: () => 'Required value',
    },
    {
        field: 'code',
        validator: requiredStringValidator,
        error: () => 'Required value',
    },
    {
        field: 'permissionRequests',
        validator: async (
            value: string | boolean | PlatformActionPermissionInput[] | PlatformDataMapInput[],
        ): Promise<-1 | 0> => {
            return (value as PlatformActionPermissionInput[]).find((_) => {
                if (
                    _.active &&
                    (_.permission === PlatformActionPermissionRequest.READ_PAGE_URL ||
                        _.permission === PlatformActionPermissionRequest.READ_REFERRER_URL)
                ) {
                    return _.urlParts === undefined || _.urlParts.length === 0;
                }
                return false;
            }) === undefined
                ? -1
                : 0;
        },
        error: () => 'Select at least one.',
    },
    {
        field: 'icon',
        validator: requiredStringValidator,
        error: () => 'Required value',
    },
];

export { TemplatedActionValidators };
