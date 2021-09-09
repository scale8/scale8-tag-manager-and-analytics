import { FormProps } from '../../../hooks/form/useFormValidation';
import { ActionGroupDistributionType } from '../../../gql/generated/globalTypes';
import { DialogPageProps } from '../../DialogTypes';

export type ActionGroupDistributionValues = {
    name: string;
    type?: ActionGroupDistributionType;
    comments: string;
};
export type ActionGroupDistributionFormProps = FormProps<ActionGroupDistributionValues> & {
    noTitle?: boolean;
};
export type ActionGroupDistributionCreateProps = DialogPageProps & {
    submitText?: string;
    noTitle?: boolean;
};
