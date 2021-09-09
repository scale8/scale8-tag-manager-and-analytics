import { EnvVariable } from '../../utils/forms/EnvironmentFormUtils';

export type EnvironmentVariablesInputProps = {
    values: EnvVariable[];
    label: string;
    add: (key: string, value: string) => void;
    remove: (key: string) => void;
};
