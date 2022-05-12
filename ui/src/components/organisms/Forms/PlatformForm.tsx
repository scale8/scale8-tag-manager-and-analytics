import { FC, useState } from 'react';
import { PlatformFormProps } from '../../../types/props/forms/PlatformFormProps';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ImageUpload from '../../atoms/ImageUpload';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { PlatformValues } from '../../../utils/forms/PlatformFormUtils';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const PlatformForm: FC<PlatformFormProps> = (props: PlatformFormProps) => {
    const [imageLoading, setImageLoading] = useState(false);

    return (
        <DialogFormContextProvider<PlatformValues> formProps={props}>
            <DrawerFormLayout {...props} submitDisable={props.isSubmitting || imageLoading}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="description" label="Description" />
                {!props.isUpdate && (
                    <DialogFormSelect
                        label="Type"
                        name="type"
                        values={[
                            {
                                key: PlatformType.CUSTOM,
                                text: 'Custom',
                            },
                            {
                                key: PlatformType.TEMPLATED,
                                text: 'Templated',
                            },
                        ]}
                    />
                )}
                <ImageUpload
                    imageLoading={imageLoading}
                    setImageLoading={setImageLoading}
                    initialUrl={props.initialUrl}
                    removeImage={props.removeImage}
                    handleImageUpload={props.handleImageUpload}
                    label={'Platform Logo'}
                />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default PlatformForm;
