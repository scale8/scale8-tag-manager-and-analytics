import { Dispatch, FC, ReactElement, SetStateAction, useEffect } from 'react';
import {
    FormLoadedData,
    FormMutationData,
    FormProps,
    FormValidationResult,
    FormValues,
    useFormValidation,
} from '../../hooks/form/useFormValidation';
import { DialogPageProps } from '../../types/DialogTypes';
import { usePageDialogControls } from '../../hooks/dialog/usePageDialogControls';
import { MutationValues } from '../../types/GqlTypes';
import { ValidateConfiguration } from '../../utils/validators/validateFormValues';
import { ApolloError } from '@apollo/client';
import { logError } from '../../utils/logUtils';

export type DialogFormProps<
    Q extends FormValues,
    F extends FormProps<Q>,
    M extends FormMutationData,
> = DialogPageProps & {
    buildInitialState?: () => Q;
    initialState?: Q;
    buildFormValidationValuesWithDataMaps?: any;
    formLoadedData?: FormLoadedData;
    buildFormProps?: (formValidationValues: FormValidationResult<Q>, gqlError?: ApolloError) => F;
    previewForm?: {
        previewPage: FC<any>;
        mapPreviewConfirmData: (formValues: Q) => { [key: string]: any };
        confirmQuery: MutationValues;
        buildPreviewFormProps: (
            formValidationValues: any,
            mutationResult?: M,
            gqlError?: ApolloError,
            formLoadedData?: FormLoadedData,
        ) => any;
    };
    buildFormPreloadProps?: any;
    pageComponent: FC<F>;
    validators: ValidateConfiguration<Q>[];
    noRefresh?: boolean;
    customValueSetter?: (
        valueKey: string,
        value: unknown,
        values: Q,
        setValues: Dispatch<SetStateAction<Q>>,
    ) => void;
    savedId?: string;
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void;
    saveQuery: MutationValues;
    mapSaveData: (formValues: Q) => { [key: string]: any };
    checkSuccessfullySubmitted: (formMutationData: M) => boolean;
    getSavedId?: (formMutationData: M) => string | undefined;
};

const DialogForm = <Q extends FormValues, F extends FormProps<Q>, M extends FormMutationData>(
    props: DialogFormProps<Q, F, M>,
): ReactElement => {
    const {
        buildInitialState,
        validators,
        pageComponent,
        buildFormProps,
        noRefresh,
        customValueSetter,
        followUp,
        saveQuery,
        mapSaveData,
        checkSuccessfullySubmitted,
        getSavedId,
        initialState,
        buildFormValidationValuesWithDataMaps,
        formLoadedData,
        buildFormPreloadProps,
        previewForm,
    } = props;

    const [save, { data, error: gqlError }] = saveQuery;

    const [confirm, { data: confirmData, error: confirmGqlError }] =
        previewForm === undefined
            ? [
                  () => {
                      // Intentionally empty
                  },
                  { data: undefined, error: undefined },
              ]
            : previewForm.confirmQuery;

    const buildSubmitForm = (): ((values: Q) => Promise<void>) => {
        return async (values: Q) => {
            try {
                await save({
                    variables: mapSaveData(values),
                });
            } catch (error) {
                logError(error);
            }
        };
    };

    const buildConfirmSubmitForm = (): ((values: Q) => Promise<void>) => {
        if (previewForm === undefined) {
            return async () => {
                // intentionally empty
            };
        } else {
            return async (values: Q) => {
                try {
                    await confirm({
                        variables: previewForm.mapPreviewConfirmData(values),
                    });
                } catch (error) {
                    logError(error);
                }
            };
        }
    };

    const submitForm = buildSubmitForm();
    const submitConfirmForm = buildConfirmSubmitForm();

    const eventuallyBuildInitialState = (): Q => {
        if (initialState !== undefined) {
            return initialState;
        }
        if (buildInitialState !== undefined) {
            return buildInitialState();
        }
        throw Error('Either initialState or buildInitialState must be defined');
    };

    const hasPreview = previewForm !== undefined;

    const formValidationResults = useFormValidation<Q>(
        eventuallyBuildInitialState(),
        validators,
        submitForm,
        false,
        customValueSetter,
    );

    const buildFormValidationValues = () => {
        if (buildFormValidationValuesWithDataMaps !== undefined) {
            return buildFormValidationValuesWithDataMaps(submitForm, validators);
        }
        return formValidationResults;
    };

    const successfullySubmitted = hasPreview
        ? checkSuccessfullySubmitted(confirmData)
        : checkSuccessfullySubmitted(data);
    const savedId = getSavedId === undefined ? undefined : getSavedId(data);

    const selectBuildFormProps = () => {
        if (formLoadedData !== undefined && buildFormPreloadProps !== undefined) {
            return buildFormPreloadProps(formLoadedData, buildFormValidationValues(), gqlError);
        }
        if (buildFormProps !== undefined) {
            return buildFormProps(buildFormValidationValues(), gqlError);
        }
        throw Error('buildFormProps is not defined');
    };

    const formValidationConfirmResults = useFormValidation<Q>(
        eventuallyBuildInitialState(),
        validators,
        submitConfirmForm,
        false,
        customValueSetter,
    );

    const confirmFormProps =
        previewForm !== undefined
            ? previewForm.buildPreviewFormProps(
                  formValidationConfirmResults,
                  data,
                  confirmGqlError,
                  formLoadedData,
              )
            : {};

    const saveFormProps = selectBuildFormProps();

    const saveFormValues = saveFormProps.values;

    usePageDialogControls(
        JSON.stringify(eventuallyBuildInitialState()) === JSON.stringify(saveFormValues),
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        !noRefresh
            ? props.pageRefresh
            : () => {
                  // no need to refresh the page
              },
        savedId,
        followUp,
    );

    useEffect(() => {
        if (hasPreview) confirmFormProps.setValues(saveFormValues);
    }, [saveFormValues, hasPreview]);

    if (previewForm !== undefined && checkSuccessfullySubmitted(data)) {
        const PreviewComponent = previewForm.previewPage;
        return <PreviewComponent {...confirmFormProps} />;
    }

    const PageComponent = pageComponent;

    return <PageComponent {...saveFormProps} />;
};

export { DialogForm };
