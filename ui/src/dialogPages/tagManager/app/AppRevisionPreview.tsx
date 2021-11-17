import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react';
import { FormProps, useFormValidation } from '../../../hooks/form/useFormValidation';
import { useQuery } from '@apollo/client';
import RevisionPreviewForm from '../../../components/organisms/Forms/RevisionPreviewForm';
import { PreviewRevisionGetData } from '../../../gql/generated/PreviewRevisionGetData';
import PreviewRevisionGetQuery from '../../../gql/queries/PreviewRevisionGetQuery';
import urlValidator from '../../../utils/validators/urlValidator';
import { DialogPageProps } from '../../../types/DialogTypes';
import { usePageDialogControls } from '../../../hooks/dialog/usePageDialogControls';
import { QueryLoaderAndError } from '../../../abstractions/QueryLoaderAndError';
import RevisionPreviewDisplayForm from '../../../components/organisms/Forms/RevisionPreviewDisplayForm';

type AppRevisionPreviewAfterSubmitProps = DialogPageProps & {
    revisionName: string;
    url: string;
};

type AppRevisionPreviewAfterLoadProps = DialogPageProps & {
    revisionName: string;
    environments: { name: string; url: string }[];
};

export type RevisionPreviewValues = {
    url: string;
    environment: string;
};

const AppRevisionPreviewFormAfterSubmit: FC<AppRevisionPreviewAfterSubmitProps> = (
    props: AppRevisionPreviewAfterSubmitProps,
) => {
    const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);

    const { url, revisionName, handleDialogClose } = props;

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        window.open(url);
        setSuccessfullySubmitted(true);
    };

    usePageDialogControls(
        false,
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    return (
        <RevisionPreviewDisplayForm
            handleSubmit={handleSubmit}
            submitText="Browser Preview"
            handleDialogClose={handleDialogClose}
            url={url}
            revisionName={revisionName}
        />
    );
};

const AppRevisionPreviewFormAfterLoad: FC<AppRevisionPreviewAfterLoadProps> = (
    props: AppRevisionPreviewAfterLoadProps,
) => {
    const [builtUrl, setBuiltUrl] = useState('');

    const { id, revisionName, environments } = props;

    const submitForm = async (revisionPreviewValues: RevisionPreviewValues) => {
        setBuiltUrl(`${revisionPreviewValues.url}#s8prev=${id}`);
    };

    const customValueSetter = (
        valueKey: string,
        value: any,
        values: RevisionPreviewValues,
        setValues: Dispatch<SetStateAction<RevisionPreviewValues>>,
    ) => {
        if (valueKey === 'environment') {
            const newUrl = (
                environments.find((_) => _.name === value) ?? {
                    name: '',
                    url: '',
                    installDomain: '',
                }
            ).url;

            setValues({
                ...values,
                [valueKey]: value,
                url: newUrl !== '' ? newUrl : values.url,
            });
        } else {
            setValues({
                ...values,
                [valueKey]: value,
            });
        }
    };

    const formValidationValues = useFormValidation<RevisionPreviewValues>(
        {
            url: '',
            environment: '',
        },
        [
            {
                field: 'url',
                validator: urlValidator,
                error: () => 'Invalid URL',
            },
        ],
        submitForm,
        false,
        customValueSetter,
    );

    usePageDialogControls(
        false,
        false,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    if (builtUrl !== '') {
        return (
            <AppRevisionPreviewFormAfterSubmit
                {...props}
                handleDialogClose={props.handleDialogClose}
                revisionName={revisionName}
                url={builtUrl}
            />
        );
    }

    const previewDialogFormProps: FormProps<RevisionPreviewValues> = {
        ...formValidationValues,
        gqlError: undefined,
        submitText: 'Preview',
        title: 'Preview',
        handleDialogClose: props.handleDialogClose,
    };

    return (
        <RevisionPreviewForm
            {...previewDialogFormProps}
            environments={environments}
            handleDialogClose={props.handleDialogClose}
            description={`Preview Revision: ${revisionName}?`}
        />
    );
};

const AppRevisionPreview: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<PreviewRevisionGetData>(
        false,
        useQuery<PreviewRevisionGetData>(PreviewRevisionGetQuery, {
            variables: { id: props.id },
        }),
        (data: PreviewRevisionGetData) => {
            return (
                <AppRevisionPreviewFormAfterLoad
                    revisionName={data.getRevision.name}
                    environments={data.getRevision.app.environments.map((_) => ({
                        name: _.name,
                        url: _.url ?? '',
                    }))}
                    {...props}
                />
            );
        },
    );
};

export default AppRevisionPreview;
