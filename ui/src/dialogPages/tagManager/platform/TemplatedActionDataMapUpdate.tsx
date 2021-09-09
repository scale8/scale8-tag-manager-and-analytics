import { Dispatch, FC, useEffect, useState } from 'react';
import { useFormValidation } from '../../../hooks/form/useFormValidation';
import { TemplatedActionDataMapFormProps } from '../../../types/props/forms/TemplatedActionDataMapFormProps';
import TemplatedActionDataMapForm from '../../../components/organisms/Forms/TemplatedActionDataMapForm';
import { PlatformDataMapInput } from '../../../types/DataMapsTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import {
    TemplatedActionDataMapValidators,
    TemplatedActionDataMapValues,
} from '../../../utils/forms/TemplatedActionDataMapFormUtils';
import { createDataMapInput, TemplatedActionValueSetter } from './TemplatedActionDataMapCreate';
import { DialogAction } from '../../../context/DialogReducer';
import { useLoggedInState } from '../../../context/AppContext';

export type TemplatedActionDataMapUpdateContextProps = {
    readOnly: boolean;
    buildInitialFormState: () => TemplatedActionDataMapValues;
    updateDataMap: (newDataMapInput: PlatformDataMapInput) => void;
};

const TemplatedActionDataMapUpdate: FC = () => {
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, dialogState } = templateInteractions;
    const { secondaryDialogValues } = dialogState;

    const { readOnly, updateDataMap, buildInitialFormState } =
        secondaryDialogValues as TemplatedActionDataMapUpdateContextProps;

    const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);

    const formInitialState: TemplatedActionDataMapValues = buildInitialFormState();

    useEffect(() => {
        if (successfullySubmitted) {
            dispatchDialogAction({ type: 'closeSecondary' });
        }
    }, [successfullySubmitted]);

    const submitForm = async (templatedActionDataMapValues: TemplatedActionDataMapValues) => {
        updateDataMap(createDataMapInput(templatedActionDataMapValues));
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
        submitText: 'Update Form Component',
        title: readOnly ? 'Inspect Form Component' : 'Update Form Component',
        formInfoProps: buildStandardFormInfo('templatedActionDataMaps', 'Update'),
        handleDialogClose: () => dispatchDialogAction({ type: 'closeSecondary' }),
        isEdit: true,
        readOnly: readOnly,
    };

    return <TemplatedActionDataMapForm {...formProps} />;
};

const triggerUpdateTemplatedActionDataMap = (
    indexes: number[],
    platformDataMaps: PlatformDataMapInput[],
    handleChange: (valueKey: string, value: any) => void,
    dispatchDialogAction: Dispatch<DialogAction>,
    readOnly: boolean,
): void => {
    const secondaryDialogValues = {
        readOnly,
        buildInitialFormState: () => {
            const findCurrentDataMap = () => {
                if (indexes.length === 1) {
                    return platformDataMaps[indexes[0]];
                } else if (indexes.length === 2) {
                    return platformDataMaps[indexes[0]].child_platform_data_maps[indexes[1]];
                } else {
                    return platformDataMaps[indexes[0]].child_platform_data_maps[indexes[1]]
                        .child_platform_data_maps[indexes[2]];
                }
            };

            const currentDataMap = findCurrentDataMap();
            return {
                key: currentDataMap.key,
                type: currentDataMap.type,
                description: currentDataMap.description,
                defaultValue: currentDataMap.default_value,
                defaultValues: currentDataMap.default_values,
                optionValues: currentDataMap.option_values,
                validationRules:
                    currentDataMap.validation_rules === undefined
                        ? undefined
                        : currentDataMap.validation_rules.map((_) => ({
                              input_value: _.input_value,
                              type: _.type,
                          })),
                optional: currentDataMap.optional,
                useDefault:
                    currentDataMap.default_value !== undefined ||
                    currentDataMap.default_values !== undefined,
            };
        },
        updateDataMap: (newDataMapInput: PlatformDataMapInput) => {
            const setPlatformDatamaps = (v: PlatformDataMapInput[]) => {
                handleChange('platformDataMaps', v);
            };
            if (indexes.length === 1) {
                setPlatformDatamaps(
                    platformDataMaps.map((d, i) => {
                        if (i === indexes[0]) {
                            return newDataMapInput;
                        } else {
                            return d;
                        }
                    }),
                );
            } else if (indexes.length === 2) {
                setPlatformDatamaps(
                    platformDataMaps.map((d, i) => {
                        if (i === indexes[0]) {
                            return {
                                ...d,
                                child_platform_data_maps: d.child_platform_data_maps.map(
                                    (dd, ii) => {
                                        if (ii === indexes[1]) {
                                            return newDataMapInput;
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
            } else if (indexes.length === 3) {
                setPlatformDatamaps(
                    platformDataMaps.map((d, i) => {
                        if (i === indexes[0]) {
                            return {
                                ...d,
                                child_platform_data_maps: d.child_platform_data_maps.map(
                                    (dd, ii) => {
                                        if (ii === indexes[1]) {
                                            return {
                                                ...dd,
                                                child_platform_data_maps:
                                                    dd.child_platform_data_maps.map((ddd, iii) => {
                                                        if (iii === indexes[2]) {
                                                            return newDataMapInput;
                                                        } else {
                                                            return ddd;
                                                        }
                                                    }),
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
    } as TemplatedActionDataMapUpdateContextProps;
    dispatchDialogAction({
        type: 'openSecondary',
        payload: {
            secondaryDialogValues,
            secondaryPageComponent: TemplatedActionDataMapUpdate,
        },
    });
};

export { TemplatedActionDataMapUpdate, triggerUpdateTemplatedActionDataMap };
