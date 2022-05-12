import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { ActionGroupDistributionType } from '../../../gql/generated/globalTypes';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { ActionGroupDistributionFormProps } from '../../../types/props/forms/ActionGroupDistributionFormProps';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';

const ActionGroupDistributionForm: FC<ActionGroupDistributionFormProps & { isUpdate?: boolean }> = (
    props: ActionGroupDistributionFormProps & { isUpdate?: boolean },
) => {
    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DialogFormField"
                required
                autoFocus
            />
            {!props.isUpdate && (
                <ControlledSelect
                    className="DialogFormField"
                    label="Type"
                    name="type"
                    values={[
                        {
                            key: ActionGroupDistributionType.NONE,
                            text: 'None',
                        },
                        {
                            key: ActionGroupDistributionType.PAGE_LOAD,
                            text: 'Page Load',
                        },
                        {
                            key: ActionGroupDistributionType.SESSION,
                            text: 'Session',
                        },
                    ]}
                    formProps={props}
                    required
                />
            )}
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DialogFormField"
            />
        </DrawerFormLayout>
    );
};

export default ActionGroupDistributionForm;
