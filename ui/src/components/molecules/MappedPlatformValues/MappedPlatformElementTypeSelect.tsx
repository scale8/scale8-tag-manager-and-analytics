import { FC } from 'react';
import { MappedPlatformElement } from '../../../types/MappedPlatformValuesTypes';
import { FormElementWithInputType } from '../../atoms/InputTypes/FormElementWithInputType';
import ObjectInput from './ObjectInput';
import { buildDataMapLabel } from '../../../utils/DataMapUtils';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../types/IngestEndpointsTypes';
import { isVarTypeObject } from '../../../utils/VarTypeUtils';
import { extractDataMapDefaultValue } from '../../../utils/MappedPlatformElementUtils';

export type MappedPlatformElementTypeSelectProps = {
    mappedPlatformElement: MappedPlatformElement;
    parentLocators: { id: string; index: number }[];
    readOnly: boolean;
    appPlatformRevisions?: AppPlatformRevision[];
    ingestEndpoints?: IngestEndpointForEnvironmentSelection[];
    environments?: { id: string; name: string }[];
    revisions?: { id: string; name: string }[];
    consentPurposes?: { id: number; name: string }[];
    consentVendors?: { id: number; name: string }[];
    formProps?: any;
};

const MappedPlatformElementTypeSelect: FC<MappedPlatformElementTypeSelectProps> = (
    props: MappedPlatformElementTypeSelectProps,
) => {
    const { mappedPlatformElement } = props;

    const varType = mappedPlatformElement.platformDataMap.var_type;

    if (isVarTypeObject(varType)) {
        return (
            <ObjectInput
                mappedPlatformElement={mappedPlatformElement}
                parentLocators={props.parentLocators}
                disabled={props.readOnly}
                {...props.formProps}
            />
        );
    } else {
        const hasFormProps = props.formProps !== undefined;

        return (
            <FormElementWithInputType
                {...{
                    label: buildDataMapLabel(mappedPlatformElement.platformDataMap.key),
                    name: mappedPlatformElement.platformDataMap.id,
                    values: mappedPlatformElement.values,
                    inputType: mappedPlatformElement.platformDataMap.input_type,
                    optionValues: mappedPlatformElement.platformDataMap.option_values ?? [],
                    setValue: (v, index) => {
                        if (hasFormProps) {
                            props.formProps.handlePlatformDataChange(
                                mappedPlatformElement.platformDataMap.id,
                                v,
                                props.parentLocators,
                                index,
                            );
                        }
                    },
                    setValues: (v) => {
                        if (hasFormProps) {
                            props.formProps.handlePlatformDataChange(
                                mappedPlatformElement.platformDataMap.id,
                                v,
                                props.parentLocators,
                            );
                        }
                    },
                    removeArrayElement: (dataMapId: string, index: number) => {
                        if (hasFormProps) {
                            props.formProps.removeArrayElement(
                                dataMapId,
                                index,
                                props.parentLocators,
                            );
                        }
                    },
                    addArrayElement: (dataMapId: string) => {
                        if (hasFormProps) {
                            props.formProps.addArrayElement(dataMapId, props.parentLocators);
                        }
                    },
                    onBlur: hasFormProps
                        ? props.formProps.handleBlur
                        : () => {
                              // Intentionally Empty
                          },
                    errors: mappedPlatformElement.errors,
                    required: !mappedPlatformElement.platformDataMap.is_optional,
                    defaultValue: extractDataMapDefaultValue(mappedPlatformElement.platformDataMap),
                    disabled: props.readOnly,
                    appPlatformRevisions: props.appPlatformRevisions,
                    ingestEndpoints: props.ingestEndpoints,
                    environments: props.environments,
                    revisions: props.revisions,
                    consentPurposes: props.consentPurposes,
                    consentVendors: props.consentVendors,
                    flatten: false,
                }}
            />
        );
    }
};

export { MappedPlatformElementTypeSelect };
