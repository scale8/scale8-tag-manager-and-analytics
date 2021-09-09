import { FormProps } from '../../../hooks/form/useFormValidation';

export type OrgTransferOwnershipValues = {
    userId: string;
};

export type OrgTransferOwnershipFormProps = FormProps<OrgTransferOwnershipValues> & {
    viableUsers: { key: string; text: string }[];
};
