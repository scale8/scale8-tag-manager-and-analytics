import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { TagType } from '../../../gql/generated/globalTypes';
import ControlledIntegerInput from '../../atoms/ControlledInputs/ControlledIntegerInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';
import { TagFormProps } from '../../../dialogPages/tagManager/app/tag/TagCreate';

const TagForm: FC<TagFormProps> = (props: TagFormProps) => {
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
            {props.existingType === null && (
                <ControlledSelect
                    className="DialogFormField"
                    label="Type"
                    name="type"
                    values={[
                        { key: TagType.HEAD, text: 'Head' },
                        { key: TagType.PLACEMENT, text: 'Placement' },
                    ]}
                    formProps={props}
                    required
                />
            )}
            {(props.existingType === TagType.PLACEMENT ||
                props.values.type === TagType.PLACEMENT) && (
                <>
                    <ControlledIntegerInput
                        name="width"
                        label="Width"
                        formProps={props}
                        className="DialogFormField"
                        required
                        autoFocus
                    />
                    <ControlledIntegerInput
                        name="height"
                        label="Height"
                        formProps={props}
                        className="DialogFormField"
                        required
                        autoFocus
                    />
                </>
            )}
            {(props.existingType === TagType.HEAD || props.values.type === TagType.HEAD) && (
                <CheckBoxInput
                    name="autoLoad"
                    value={props.values.autoLoad}
                    setValue={(v) => {
                        props.handleChange('autoLoad', v);
                    }}
                    label="Load the tag automatically"
                    className="DialogFormField"
                    sx={{ marginLeft: '-11px!important' }}
                    color="primary"
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

export default TagForm;
