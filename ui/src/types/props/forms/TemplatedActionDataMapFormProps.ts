import { FormProps } from '../../../hooks/form/useFormValidation';
import { TemplatedActionDataMapValues } from '../../../utils/forms/TemplatedActionDataMapFormUtils';

export type TemplatedActionDataMapFormProps = FormProps<TemplatedActionDataMapValues> & {
    isEdit: boolean;
    readOnly: boolean;
};
