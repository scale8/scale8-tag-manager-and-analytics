import { FormProps } from '../../hooks/form/useFormValidation';

export type AppRevisionDeployValues = {
    environmentId: string;
};

export type AppRevisionDeployFormProps = FormProps<AppRevisionDeployValues> & {
    availableEnvironments: { key: string; text: string }[];
};
