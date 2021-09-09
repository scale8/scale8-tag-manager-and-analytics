import { FC, useState } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { PlatformFormProps } from '../../../types/props/forms/PlatformFormProps';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ImageUpload from '../../atoms/ImageUpload';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { PlatformType } from '../../../gql/generated/globalTypes';

const PlatformForm: FC<PlatformFormProps> = (props: PlatformFormProps) => {
    const [imageLoading, setImageLoading] = useState(false);

    return (
        <DrawerFormLayout {...props} submitDisable={props.isSubmitting || imageLoading}>
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />
            <ControlledTextAreaInput
                name="description"
                label="Description"
                formProps={props}
                className="DrawerFormField"
                required
            />
            {!props.isUpdate && (
                <ControlledSelect
                    className="DrawerFormField"
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
                    formProps={props}
                    required
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
    );
};

export default PlatformForm;
