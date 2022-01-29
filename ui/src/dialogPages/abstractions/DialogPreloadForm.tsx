import { QueryResult } from '@apollo/client/react/types/types';
import {
    FormLoadedData,
    FormMutationData,
    FormProps,
    FormValues,
} from '../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client/errors';
import { DataMap } from '../../types/DataMapsTypes';
import {
    FormWithMappedPlatformValuesResult,
    ModelWithPlatformDataMaps,
    useFormWithMappedPlatformValues,
} from '../../hooks/form/useFormWithMappedPlatformValues';
import { DialogForm, DialogFormProps } from './DialogForm';
import { ReactElement } from 'react';
import { ValidateConfiguration } from '../../utils/validators/validateFormValues';
import GQLError from '../../components/atoms/GqlError';
import { MainDrawerTitle } from '../../components/molecules/MainDrawerTitle';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';

export type DialogPreloadFormProps<
    T extends FormLoadedData,
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
> = Omit<DialogFormProps<Q, F, M>, 'buildFormProps' | 'buildInitialState | formLoadedData'> & {
    loadQuery: QueryResult<T>;
    buildInitialStatePreload: (formLoadedData: T) => Q;
    buildFormProps: (formLoadedData: T, formValidationValues: any, gqlError?: ApolloError) => F;
    mappedPlatformValuesProps?: {
        buildAvailableModelsWithPlatformDataMaps: (
            formLoadedData: T,
        ) => ModelWithPlatformDataMaps[];
        idValueForModelWithPlatformDataMaps: string;
        buildExistingModelData?: (formLoadedData: T) => {
            id: string;
            dataMaps: DataMap[];
        };
    };
};

export type DialogFormAfterLoadProps<
    T extends FormLoadedData,
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
> = DialogPreloadFormProps<T, Q, F, M> & {
    formLoadedData: any;
};

const DialogFormWithPlatformDatMaps = <
    T extends FormLoadedData,
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
>(
    props: DialogFormAfterLoadProps<T, Q, F, M>,
) => {
    const {
        formLoadedData,
        buildInitialStatePreload,
        buildFormProps,
        mappedPlatformValuesProps,
        ...dialogFormProps
    } = props;

    const useBuildFormValidationValuesWithDataMaps = (
        submitForm: (values: Q) => Promise<void>,
        validators: ValidateConfiguration<Q>[],
    ): FormWithMappedPlatformValuesResult<Q> => {
        return useFormWithMappedPlatformValues<Q>(
            buildInitialStatePreload(formLoadedData),
            validators,
            submitForm,
            mappedPlatformValuesProps!.buildAvailableModelsWithPlatformDataMaps(formLoadedData),
            mappedPlatformValuesProps!.idValueForModelWithPlatformDataMaps,
            mappedPlatformValuesProps!.buildExistingModelData === undefined
                ? undefined
                : mappedPlatformValuesProps!.buildExistingModelData(formLoadedData),
        );
    };

    return (
        <DialogForm
            formLoadedData={formLoadedData as FormLoadedData}
            initialState={buildInitialStatePreload(formLoadedData)}
            buildFormPreloadProps={buildFormProps}
            buildFormValidationValuesWithDataMaps={useBuildFormValidationValuesWithDataMaps}
            {...dialogFormProps}
        />
    );
};

const FormAfterLoad = <
    T extends FormLoadedData,
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
>(
    props: DialogFormAfterLoadProps<T, Q, F, M>,
) => {
    const {
        formLoadedData,
        buildInitialStatePreload,
        buildFormProps,
        mappedPlatformValuesProps,
        ...dialogFormProps
    } = props;

    if (mappedPlatformValuesProps === undefined) {
        return (
            <DialogForm
                formLoadedData={formLoadedData as FormLoadedData}
                initialState={buildInitialStatePreload(formLoadedData)}
                buildFormPreloadProps={buildFormProps}
                {...dialogFormProps}
            />
        );
    }

    return <DialogFormWithPlatformDatMaps {...props} />;
};

const DialogPreloadForm = <
    T extends FormLoadedData,
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
>(
    props: DialogPreloadFormProps<T, Q, F, M>,
): ReactElement => {
    return QueryLoaderAndError<T>(
        false,
        props.loadQuery,
        (data: T) => <FormAfterLoad formLoadedData={data} {...props} />,
        false,
        undefined,
        (error: ApolloError) => (
            <>
                <MainDrawerTitle handleDialogClose={props.handleDialogClose}>
                    Error Loading Data
                </MainDrawerTitle>
                <GQLError error={error} />
            </>
        ),
    );
};

export { DialogPreloadForm };
