import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ConditionRuleForm from '../../../../components/organisms/Forms/ConditionRuleForm';
import {
    buildConditionRuleUpdateInput,
    ConditionRuleFormProps,
    ConditionRuleValues,
    findDataElementById,
    useConditionRuleForm,
} from '../../../../hooks/form/useConditionRuleForm';
import { SelectValueWithSub } from '../../../../hooks/form/useFormValidation';
import { DataContainer, PlatformDataMap } from '../../../../types/DataMapsTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { usePageDialogControls } from '../../../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { QueryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';
import UpdateConditionRuleGetQuery from '../../../../gql/queries/UpdateConditionRuleGetQuery';
import {
    UpdateConditionRuleGetData,
    UpdateConditionRuleGetData_getConditionRule_match_CustomMatch,
    UpdateConditionRuleGetData_getConditionRule_match_PlatformDataMap,
} from '../../../../gql/generated/UpdateConditionRuleGetData';
import { buildDataMapLabel, dataMapValueToString } from '../../../../utils/DataMapUtils';
import { controlledSelectValuesFindByInnerKey } from '../../../../utils/ControlledSelectUtils';
import UpdateConditionRuleQuery from '../../../../gql/mutations/UpdateConditionRuleQuery';
import { UpdateConditionRule } from '../../../../gql/generated/UpdateConditionRule';
import { matchConditionValues } from '../../../../utils/MatchConditionValues';
import { useConfigState } from '../../../../context/AppContext';
import { logError } from '../../../../utils/logUtils';
import {
    buildDataContainersSelectValues,
    getAvailableDataContainers,
} from '../../../../utils/DataContainersUtils';

type ConditionRuleUpdateProps = DialogPageProps & {
    submitText: string;
    title: string;
    infoKeyBase: string;
};

type ConditionRuleUpdateAfterLoadProps = ConditionRuleUpdateProps & {
    availableDataContainers: DataContainer[];
    dataContainersSelectValues: SelectValueWithSub[];
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
    initialState: ConditionRuleValues;
    initialPlatformId: string;
};

const buildConditionName = (
    values: ConditionRuleValues,
    dataContainers: SelectValueWithSub[],
    currentDataContainer?: DataContainer,
): string => {
    const currentDataElement: PlatformDataMap | undefined =
        currentDataContainer && values.matchId !== ''
            ? findDataElementById(currentDataContainer.platform_data_maps, values.matchId)
            : undefined;

    const matchValue = dataMapValueToString(values.dataMapValue);

    const matchingCondition = matchConditionValues.find(
        (matchValue) => matchValue.condition === values.matchCondition,
    );
    const conditionSymbol = matchingCondition ? matchingCondition.symbol : '';

    const match = currentDataElement ? buildDataMapLabel(currentDataElement.key) : values.match;

    const selectedDataContainer = controlledSelectValuesFindByInnerKey(
        dataContainers,
        values.dataContainerId,
    );

    if (!selectedDataContainer) {
        return '';
    }

    return `${match} ${conditionSymbol} ${matchValue}`;
};

//const builtNameUsed = (formLoadedData: UpdateConditionRuleGetData): boolean =>

const ConditionRuleUpdateAfterLoad: FC<ConditionRuleUpdateAfterLoadProps> = (
    props: ConditionRuleUpdateAfterLoadProps,
) => {
    const [updateConditionRule, { loading, data, error: gqlError }] =
        useMutation<UpdateConditionRule>(UpdateConditionRuleQuery);

    const submitForm = async (conditionRuleValues: ConditionRuleValues) => {
        const conditionRuleUpdateInput = buildConditionRuleUpdateInput(
            props.id,
            conditionRuleValues,
        );

        try {
            await updateConditionRule({
                variables: { conditionRuleUpdateInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const conditionRuleFormValues = useConditionRuleForm(
        props.initialState,
        submitForm,
        props.availableDataContainers,
    );

    const successfullySubmitted = !!data?.updateConditionRule;

    usePageDialogControls(
        JSON.stringify(props.initialState) === JSON.stringify(conditionRuleFormValues.values),
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    if (loading || successfullySubmitted) {
        return <div />;
    }

    const formProps: ConditionRuleFormProps = {
        ...conditionRuleFormValues,
        gqlError,
        submitText: props.submitText,
        title: props.title,
        formInfoProps: buildStandardFormInfo(props.infoKeyBase, 'Update'),
        handleDialogClose: props.handleDialogClose,
        dataContainers: props.dataContainersSelectValues,
        update: true,
        initialPlatformId: props.initialPlatformId,
        consentPurposes: props.consentPurposes,
        consentVendors: props.consentVendors,
        generateName:
            props.initialState.name ===
            buildConditionName(
                conditionRuleFormValues.values,
                props.dataContainersSelectValues,
                conditionRuleFormValues.currentDataContainer,
            ),
    };

    return <ConditionRuleForm {...formProps} />;
};

const ConditionRuleUpdate: FC<ConditionRuleUpdateProps> = (props: ConditionRuleUpdateProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    return QueryLoaderAndError<UpdateConditionRuleGetData>(
        false,
        useQuery<UpdateConditionRuleGetData>(UpdateConditionRuleGetQuery, {
            variables: { conditionId: props.id, triggerId: props.contextId },
        }),
        (data: UpdateConditionRuleGetData) => {
            const formInitialState = {
                name: data.getConditionRule.name,
                dataContainerId: data.getConditionRule.platform_data_container.id,
                match:
                    (
                        data.getConditionRule
                            .match as UpdateConditionRuleGetData_getConditionRule_match_CustomMatch
                    ).custom_key ?? '',
                matchId:
                    (
                        data.getConditionRule
                            .match as UpdateConditionRuleGetData_getConditionRule_match_PlatformDataMap
                    ).id ?? '',
                matchKey: data.getConditionRule.match_key ?? '',
                matchCondition: data.getConditionRule.match_condition,
                dataMapValue: data.getConditionRule.match_value,
                comments: '',
            };

            return (
                <ConditionRuleUpdateAfterLoad
                    initialPlatformId={data.getConditionRule.platform_data_container.platform.id}
                    initialState={formInitialState}
                    consentPurposes={consentPurposes}
                    consentVendors={consentVendors}
                    availableDataContainers={getAvailableDataContainers(
                        data.getTrigger.revision.app_platform_revisions,
                    )}
                    dataContainersSelectValues={buildDataContainersSelectValues(
                        data.getTrigger.revision.app_platform_revisions,
                    )}
                    {...props}
                />
            );
        },
    );
};

export { ConditionRuleUpdate, buildConditionName };
