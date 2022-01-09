import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';
import urlValidator from '../validators/urlValidator';

export type EnvVariable = { key: string; value: string };

export type EnvironmentValues = {
    name: string;
    url: string;
    revisionId: string;
    variables?: EnvVariable[];
    comments: string;
};

const EnvironmentCreateValidators: ValidateConfiguration<EnvironmentValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Environment name too short',
    },
    {
        field: 'url',
        validator: urlValidator,
        error: () => 'Invalid URL',
        ignoreEmpty: true,
    },
];

const EnvironmentUpdateValidators: ValidateConfiguration<EnvironmentValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Environment name too short',
    },
    {
        field: 'url',
        validator: urlValidator,
        error: () => 'Invalid URL',
        ignoreEmpty: true,
    },
];

export { EnvironmentCreateValidators, EnvironmentUpdateValidators };
