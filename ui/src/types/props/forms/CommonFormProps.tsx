import { FormEvent } from 'react';
import { InfoProps } from '../../../components/molecules/InfoButton';
import { ApolloError } from '@apollo/client';

export type FormCommonProps = FormBaseProps & {
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    handleChange: (
        valueKey: string,
        value: any,
        extraValues?: { valueKey: string; value: any }[],
    ) => void;
    handleBlur: () => void;
    isSubmitting: boolean;
};

export type FormBaseProps = {
    submitText?: string;
    title: string;
    formInfoProps?: InfoProps;
    gqlError?: ApolloError;
    handleDialogClose: (checkChanges: boolean) => void;
    previewValues?: any;
};
