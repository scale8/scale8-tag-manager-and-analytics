import { FC } from 'react';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import ControlledFilteredSelects from '../../atoms/ControlledInputs/ControlledFilteredSelects';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { AppPlatformRevisionFormProps } from '../../../dialogPages/tagManager/app/LinkPlatformRevision';

const PlatformRevisionSelect: FC<AppPlatformRevisionFormProps> = (
    props: AppPlatformRevisionFormProps,
) => {
    const { availableAppPlatformRevisions, isEdit } = props;
    const notAvailable = props.availableAppPlatformRevisions.length < 1;
    const onlyOne = props.availableAppPlatformRevisions.length === 1;

    if (notAvailable) {
        return <small className="DialogFormField">There are no more platforms available.</small>;
    }

    if (isEdit && onlyOne) {
        return (
            <small className="DialogFormField">
                There is only one platform revision available.
            </small>
        );
    }

    return (
        <ControlledFilteredSelects
            className="DialogFormField"
            label="Platform Revision"
            name="platformRevisionId"
            values={availableAppPlatformRevisions}
            formProps={props}
            required
            filterLabel="Platform"
            missingSubMessage="There are no revisions available."
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
    );
};

export default AppPlatformRevisionForm;
