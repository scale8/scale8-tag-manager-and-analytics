import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useFormValidation } from '../../../hooks/form/useFormValidation';
import { TemplatedActionDataMapFormProps } from '../../../types/props/forms/TemplatedActionDataMapFormProps';
import TemplatedActionDataMapForm from '../../../components/organisms/Forms/TemplatedActionDataMapForm';
import { PlatformDataMapInput } from '../../../types/DataMapsTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import {
    TemplatedActionDataMapValidators,
    TemplatedActionDataMapValues,
} from '../../../utils/forms/TemplatedActionDataMapFormUtils';
import { getPlatformDataMapVarType } from '../../../utils/PlatformDataMapTypeUtils';
import { VarType } from '../../../gql/generated/globalTypes';
import { DialogAction } from '../../../context/DialogReducer';
import { useLoggedInState } from '../../../context/AppContext';

export type TemplatedActionDataMapCreateContextProps = {
    addNewDataMap: (newDataMapInput: PlatformDataMapInput) => void;
};

const triggerAddTemplatedActionDataMap = (
    parentsIndexes: number[],
    platformDataMaps: PlatformDataMapInput[],
    handleChange: (valueKey: string, value: any) => void,
    dispatchDialogAction: Dispatch<DialogAction>,
): void => {
    const secondaryDialogValues = {
        addNewDataMap: (newDataMapInput: PlatformDataMapInput) => {
            const setPlatformDatamaps = (v: PlatformDataMapInput[]) => {
                handleChange('platformDataMaps', v);
            };

            if (parentsIndexes.length === 0) {
                setPlatformDatamaps([...platformDataMaps, newDataMapInput]);
            } else if (parentsIndexes.length === 1) {
                setPlatformDatamaps(
                    platformDataMaps.map((d, i) => {
                        if (i === parentsIndexes[0]) {
                            return {
                                ...d,
                                child_platform_data_maps: [
                                    ...d.child_platform_data_maps,
                                    newDataMapInput,
                                ],
                            };
                        } else {
                            return d;
                        }
                    }),
                );
            } else if (parentsIndexes.length === 2) {
                setPlatformDatamaps(
                    platformDataMaps.map((d, i) => {
                        if (i === parentsIndexes[0]) {
                            return {
                                ...d,
                                child_platform_data_maps: d.child_platform_data_maps.map(
                                    (dd, ii) => {
                                        if (ii === parentsIndexes[1]) {
                                            return {
                                                ...dd,
                                                child_platform_data_maps: [
                                                    ...dd.child_platform_data_maps,
                                                    newDataMapInput,
                                                ],
                                            };
                                        } else {
                                            return dd;
                                        }
                                    },
                                ),
                            };
                        } else {
                            return d;
                        }
                    }),
                );
            }
        },
    } as TemplatedActionDataMapCreateContextProps;
    dispatchDialogAction({
        type: 'openSecondary',
        payload: {
            secondaryDialogValues,
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            secondaryPageComponent: TemplatedActionDataMapCreate,
        },
    });
};

const TemplatedActionValueSetter = (
    valueKey: string,
    value: unknown,
    values: TemplatedActionDataMapValues,
    setValues: Dispatch<SetStateAction<TemplatedActionDataMapValues>>,
): void => {
    if (valueKey === 'type') {
        setValues({
            ...values,
            [valueKey]: value as string,
            optional: value !== 'Radio' && value !== 'Checkbox',
            useDefault: false,
            defaultValue:
                getPlatformDataMapVarType(value as string) === VarType.BOOLEAN ? false : '', // boolean select will default to '' otherwise
            defaultValues: [],
            validationRules: undefined,
            optionValues: undefined,
        });
    } else {
        setValues({
            ...values,
            [valueKey]: value,
        });
    }
};

const TemplatedActionDataMapCreate: FC = () => {
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, dialogState } = templateInteractions;
    const { secondaryDialogValues } = dialogState;

    const { addNewDataMap } = secondaryDialogValues as TemplatedActionDataMapCreateContextProps;

    const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);

    const formInitialState: TemplatedActionDataMapValues = {
        key: '',
        type: '',
        description: '',
        defaultValue: '',
        defaultValues: [],
        optionValues: undefined,
        validationRules: undefined,
        optional: true,
        useDefault: false,
    };

    useEffect(() => {
        if (successfullySubmitted) {
            dispatchDialogAction({ type: 'closeSecondary' });
        }
    }, [successfullySubmitted]);

    const submitForm = async (templatedActionDataMapValues: TemplatedActionDataMapValues) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        addNewDataMap(createDataMapInput(templatedActionDataMapValues));
        setSuccessfullySubmitted(true);
    };

    const formValidationValues = useFormValidation<TemplatedActionDataMapValues>(
        formInitialState,
        TemplatedActionDataMapValidators,
        submitForm,
        false,
        TemplatedActionValueSetter,
        true,
    );

    const formProps: TemplatedActionDataMapFormProps = {
        ...formValidationValues,
        submitText: 'Add Form Component',
        title: 'Add Form Component',
        formInfoProps: buildStandardFormInfo('templatedActionDataMaps', 'Create'),
        handleDialogClose: () => dispatchDialogAction({ type: 'closeSecondary' }),
        isEdit: false,
        readOnly: false,
    };

    return <TemplatedActionDataMapForm {...formProps} />;
};

export const createDataMapInput = (
    templatedActionDataMapValues: TemplatedActionDataMapValues,
): PlatformDataMapInput => {
    const useArrayDefault =
        templatedActionDataMapValues.type === 'Float Array' ||
        templatedActionDataMapValues.type === 'Int Array' ||
        templatedActionDataMapValues.type === 'Text Array' ||
        templatedActionDataMapValues.type === 'Textarea Array';

    return {
        key: templatedActionDataMapValues.key,
        type: templatedActionDataMapValues.type,
        description: templatedActionDataMapValues.description,
        default_value:
            templatedActionDataMapValues.useDefault && !useArrayDefault
                ? templatedActionDataMapValues.defaultValue
                : undefined,
        default_values:
            templatedActionDataMapValues.useDefault && useArrayDefault
                ? templatedActionDataMapValues.defaultValues
                : undefined,
        optional: templatedActionDataMapValues.useDefault
            ? true
            : templatedActionDataMapValues.optional,
        option_values:
            templatedActionDataMapValues.optionValues === undefined
                ? undefined
                : templatedActionDataMapValues.optionValues,
        validation_rules:
            templatedActionDataMapValues.validationRules === undefined
                ? undefined
                : templatedActionDataMapValues.validationRules,
        child_platform_data_maps: [],
    };
};

export {
    TemplatedActionDataMapCreate,
    triggerAddTemplatedActionDataMap,
    TemplatedActionValueSetter,
};
