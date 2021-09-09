import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import FetchAvailableGlobalActionsQuery from '../../../../gql/queries/FetchAvailableGlobalActionsQuery';
import { FetchAvailableGlobalActions } from '../../../../gql/generated/FetchAvailableGlobalActions';
import GlobalActionLinkForm from '../../../../components/organisms/Forms/GlobalActionLinkForm';
import LinkGlobalActionQuery from '../../../../gql/mutations/LinkGlobalActionQuery';
import { LinkGlobalActionResult } from '../../../../gql/generated/LinkGlobalActionResult';

export type ActionGroupDistributionLinkValues = {
    globalActionGroupDistributionId: string;
};

export type ActionGroupDistributionLinkFormProps = FormProps<ActionGroupDistributionLinkValues> & {
    availableGlobalActions: { key: string; text: string }[];
};

const ActionGroupDistributionLink: FC<DialogPageProps> = (props: DialogPageProps) => {
    const globalActionLinkProps: DialogPreloadFormProps<
        FetchAvailableGlobalActions,
        ActionGroupDistributionLinkValues,
        ActionGroupDistributionLinkFormProps,
        LinkGlobalActionResult
    > = {
        loadQuery: useQuery<FetchAvailableGlobalActions>(FetchAvailableGlobalActionsQuery, {
            variables: { tagId: props.contextId, ruleId: props.id },
        }),
        buildInitialStatePreload: () => ({
            globalActionGroupDistributionId: '',
        }),
        saveQuery: useMutation(LinkGlobalActionQuery),
        mapSaveData: (values: ActionGroupDistributionLinkValues) => ({
            globalActionGroupDistributionLinkInput: {
                rule_id: props.id,
                global_action_group_distribution_id: values.globalActionGroupDistributionId,
            },
        }),
        buildFormProps: (
            formLoadedData: FetchAvailableGlobalActions,
            formValidationValues: FormValidationResult<ActionGroupDistributionLinkValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Link Global Action Group Distribution',
            title: 'Link Global Action Group Distribution',
            formInfoProps: buildStandardFormInfo('actionGroupDistributions', 'Link'),
            handleDialogClose: props.handleDialogClose,
            availableGlobalActions: formLoadedData.getTag.revision.global_action_group_distributions
                .filter(
                    (_) =>
                        !formLoadedData.getRule.action_groups_distributions
                            .map((d) => d.id)
                            .includes(_.id),
                )
                .map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.linkGlobalActionGroupDistribution,
        pageComponent: GlobalActionLinkForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAvailableGlobalActions,
            ActionGroupDistributionLinkValues,
            ActionGroupDistributionLinkFormProps,
            LinkGlobalActionResult
        >
            {...globalActionLinkProps}
        />
    );
};

export { ActionGroupDistributionLink };
