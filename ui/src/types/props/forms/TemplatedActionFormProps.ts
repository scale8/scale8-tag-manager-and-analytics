import { FormProps } from '../../../hooks/form/useFormValidation';
import { TemplatedActionsValues } from '../../../utils/forms/TemplatedActionFormUtils';

export type TemplatedActionFormProps = FormProps<TemplatedActionsValues> & {
    readOnly: boolean;
    isEdit: boolean;
    userIsAdmin: boolean;
};
