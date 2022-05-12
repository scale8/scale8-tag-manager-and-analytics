import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    AppPlatformFormProps,
    AppPlatformValues,
} from '../../../dialogPages/tagManager/app/InstallAppPlatform';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const AppPlatformForm: FC<AppPlatformFormProps> = (props: AppPlatformFormProps) => {
    const notAvailable = props.availableAppPlatforms.length < 1;

    return (
        <DialogFormContextProvider<AppPlatformValues> formProps={props}>
            <DrawerFormLayout {...props}>
                {notAvailable ? (
                    <small>There are no more platforms available.</small>
                ) : (
                    <DialogFormSelect
                        label="Platform"
                        name="platformId"
                        values={props.availableAppPlatforms}
                    />
                )}
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default AppPlatformForm;
