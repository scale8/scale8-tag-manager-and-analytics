import { FC } from 'react';
import { TagType } from '../../../gql/generated/globalTypes';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { TagFormProps, TagValues } from '../../../dialogPages/tagManager/app/tag/TagCreate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormCheckbox } from '../../atoms/DialogFormInputs/DialogFormCheckbox';
import { DialogFormIntegerInput } from '../../atoms/DialogFormInputs/DialogFormIntegerInput';

const TagForm: FC<TagFormProps> = (props: TagFormProps) => {
    return (
        <DialogFormContextProvider<TagValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                {props.existingType === null && (
                    <DialogFormSelect
                        label="Type"
                        name="type"
                        values={[
                            { key: TagType.HEAD, text: 'Head' },
                            { key: TagType.PLACEMENT, text: 'Placement' },
                        ]}
                    />
                )}
                {(props.existingType === TagType.PLACEMENT ||
                    props.values.type === TagType.PLACEMENT) && (
                    <>
                        <DialogFormIntegerInput name="width" label="Width" autoFocus />
                        <DialogFormIntegerInput name="height" label="Height" autoFocus />
                    </>
                )}
                {(props.existingType === TagType.HEAD || props.values.type === TagType.HEAD) && (
                    <DialogFormCheckbox
                        name="autoLoad"
                        label="Load the tag automatically"
                        realignLeft
                    />
                )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default TagForm;
