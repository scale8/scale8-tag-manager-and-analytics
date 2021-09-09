import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { ActionGroupDistributionLinkFormProps } from '../../../dialogPages/tagManager/app/action/ActionGroupDistributionLink';

const GlobalActionLinkForm: FC<ActionGroupDistributionLinkFormProps> = (
    props: ActionGroupDistributionLinkFormProps,
) => {
    return (
        <DrawerFormLayout
            {...props}
            noTitle
            submitDisable={props.isSubmitting || props.availableGlobalActions.length === 0}
        >
            {props.availableGlobalActions.length === 0 ? (
                <small>There are no global action group distributions available.</small>
            ) : (
                <ControlledSelect
                    className="DrawerFormField"
                    label="Global Action Group Distribution"
                    name="globalActionGroupDistributionId"
                    values={props.availableGlobalActions}
                    formProps={props}
                    required
                />
            )}
        </DrawerFormLayout>
    );
};

export default GlobalActionLinkForm;
