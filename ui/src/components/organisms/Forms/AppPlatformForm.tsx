import { FC } from 'react';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { AppPlatformFormProps } from '../../../dialogPages/tagManager/app/InstallAppPlatform';

const AppPlatformForm: FC<AppPlatformFormProps> = (props: AppPlatformFormProps) => {
    const notAvailable = props.availableAppPlatforms.length < 1;

    return (
        <DrawerFormLayout {...props}>
            {notAvailable ? (
                <small>There are no more platforms available.</small>
            ) : (
                <ControlledSelect
                    className="DrawerFormField"
                    label="Platform"
                    name="platformId"
                    values={props.availableAppPlatforms}
                    formProps={props}
                    required
                />
            )}
        </DrawerFormLayout>
    );
};

export default AppPlatformForm;
