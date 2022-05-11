import { FC } from 'react';
import { ActionGroupDistributionType } from '../../../gql/generated/globalTypes';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    ActionGroupDistributionFormProps,
    ActionGroupDistributionValues,
} from '../../../types/props/forms/ActionGroupDistributionFormProps';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

const ActionGroupDistributionForm: FC<ActionGroupDistributionFormProps & { isUpdate?: boolean }> = (
    props: ActionGroupDistributionFormProps & { isUpdate?: boolean },
) => {
    return (
        <DialogFormContextProvider<ActionGroupDistributionValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                {!props.isUpdate && (
                    <DialogFormSelect
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
                    />
                )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default ActionGroupDistributionForm;
