import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    ActionGroupDistributionLinkFormProps,
    ActionGroupDistributionLinkValues,
} from '../../../dialogPages/tagManager/app/action/ActionGroupDistributionLink';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const GlobalActionLinkForm: FC<ActionGroupDistributionLinkFormProps> = (
    props: ActionGroupDistributionLinkFormProps,
) => {
    return (
        <DialogFormContextProvider<ActionGroupDistributionLinkValues> formProps={props}>
            <DrawerFormLayout
                {...props}
                noTitle
                submitDisable={props.isSubmitting || props.availableGlobalActions.length === 0}
            >
                {props.availableGlobalActions.length === 0 ? (
                    <small>There are no global action group distributions available.</small>
                ) : (
                    <DialogFormSelect
                        label="Global Action Group Distribution"
                        name="globalActionGroupDistributionId"
                        values={props.availableGlobalActions}
                    />
                )}
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default GlobalActionLinkForm;
