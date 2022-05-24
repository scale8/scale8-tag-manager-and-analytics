import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import OrgTransferOwnershipGetQuery from '../../gql/queries/OrgTransferOwnershipGetQuery';
import { OrgTransferOwnershipGetData } from '../../gql/generated/OrgTransferOwnershipGetData';
import { useMutation, useQuery } from '@apollo/client';
import {
    OrgTransferOwnershipFormProps,
    OrgTransferOwnershipValues,
} from '../../types/props/forms/OrgTransferOwnershipFormProps';
import { OrgTransferOwnershipResult } from '../../gql/generated/OrgTransferOwnershipResult';
import OrgTransferOwnershipQuery from '../../gql/mutations/OrgTransferOwnershipQuery';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client/errors';
import OrgTransferOwnershipForm from '../../components/organisms/Forms/OrgTransferOwnershipForm';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';
import { toOrg } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';

const OrgTransferOwnership: FC<DialogPageProps> = (props: DialogPageProps) => {
    const router = useRouter();

    const transferProps: DialogPreloadFormProps<
        OrgTransferOwnershipGetData,
        OrgTransferOwnershipValues,
        OrgTransferOwnershipFormProps,
        OrgTransferOwnershipResult
    > = {
        loadQuery: useQuery<OrgTransferOwnershipGetData>(OrgTransferOwnershipGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            userId: '',
        }),
        saveQuery: useMutation<OrgTransferOwnershipResult>(OrgTransferOwnershipQuery),
        mapSaveData: (formValues: OrgTransferOwnershipValues) => ({
            transferOwnershipInput: {
                org_id: props.id,
                user_id: formValues.userId,
            },
        }),
        buildFormProps: (
            formLoadedData: OrgTransferOwnershipGetData,
            formValidationValues: FormValidationResult<OrgTransferOwnershipValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Transfer Ownership',
            title: 'Transfer Ownership',
            handleDialogClose: props.handleDialogClose,
            viableUsers: formLoadedData.getOrg.users
                .filter((_) => !_.owner && _.permissions.is_admin)
                .map((_) => ({
                    key: _.id,
                    text: `${_.first_name} ${_.last_name}`,
                })),
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.transferOwnership,
        pageComponent: OrgTransferOwnershipForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            OrgTransferOwnershipGetData,
            OrgTransferOwnershipValues,
            OrgTransferOwnershipFormProps,
            OrgTransferOwnershipResult
        >
            {...transferProps}
            pageRefresh={() => {
                router.push(toOrg({ id: props.id }, 'users')).then();
            }}
        />
    );
};

export default OrgTransferOwnership;
