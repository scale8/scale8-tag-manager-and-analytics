import { FC } from 'react';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    AppPlatformRevisionFormProps,
    AppPlatformRevisionValues,
} from '../../../dialogPages/tagManager/app/LinkPlatformRevision';
import { DialogPlainAlert } from '../../atoms/DialogFormInputs/DialogPlainAlert';
import { DialogFormFilteredSelects } from '../../atoms/DialogFormInputs/DialogFormFilteredSelects';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

const PlatformRevisionSelect: FC<AppPlatformRevisionFormProps> = (
    props: AppPlatformRevisionFormProps,
) => {
    const { availableAppPlatformRevisions, isEdit } = props;
    const notAvailable = props.availableAppPlatformRevisions.length < 1;
    const onlyOne = props.availableAppPlatformRevisions.length === 1;

    if (notAvailable) {
        return <DialogPlainAlert>There are no more platforms available.</DialogPlainAlert>;
    }

    if (isEdit && onlyOne) {
        return <DialogPlainAlert>There is only one platform revision available.</DialogPlainAlert>;
    }

    return (
        <DialogFormFilteredSelects
            label="Platform Revision"
            name="platformRevisionId"
            values={availableAppPlatformRevisions}
            filterLabel="Platform"
            missingSubMessage="There are no revisions available."
            showNoSub
        />
    );
};

const AppPlatformRevisionForm: FC<AppPlatformRevisionFormProps> = (
    props: AppPlatformRevisionFormProps,
) => {
    const { isEdit } = props;
    const notAvailable = props.availableAppPlatformRevisions.length < 1;
    const onlyOne = props.availableAppPlatformRevisions.length === 1;

    return (
        <DialogFormContextProvider<AppPlatformRevisionValues> formProps={props}>
            <DrawerFormLayout
                {...props}
                noSubmit={notAvailable || (isEdit && onlyOne)}
                submitDisable={
                    props.isSubmitting || props.values.platformRevisionId === props.initialId
                }
            >
                <PlatformRevisionSelect {...props} />
                {props.values.mappedPlatformValues !== undefined && (
                    <MappedPlatformValuesForm
                        mappedPlatformValues={props.values.mappedPlatformValues}
                        parentLocators={[]}
                        {...props}
                    />
                )}
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default AppPlatformRevisionForm;
