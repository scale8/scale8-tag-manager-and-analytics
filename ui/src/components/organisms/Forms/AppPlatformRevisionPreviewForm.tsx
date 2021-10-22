import { FC, Fragment } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { FormBaseProps } from '../../../types/props/forms/CommonFormProps';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { DialogContentText, List, ListItem, ListItemText } from '@mui/material';
import { AppPlatformRevisionValues } from '../../../dialogPages/tagManager/app/LinkPlatformRevision';

export type AppPlatformRevisionPreviewProps = FormValidationResult<AppPlatformRevisionValues> &
    FormBaseProps & {
        revisionName: string;
        groups: { title: string; items: { name: string; id: string }[] }[];
    };

const AppPlatformRevisionPreviewForm: FC<AppPlatformRevisionPreviewProps> = (
    props: AppPlatformRevisionPreviewProps,
) => {
    return (
        <DrawerFormLayout {...props}>
            <DialogContentText id="alert-dialog-description">
                {props.groups.length === 0
                    ? `Change to Revision: ${props.revisionName}?`
                    : `Changing to Revision "${props.revisionName}" will require the removal of:`}
            </DialogContentText>
            <List
                dense
                sx={{
                    padding: (theme) => theme.spacing(0, 2),
                }}
            >
                {props.groups.map((group, key) => (
                    <Fragment key={key}>
                        <ListItemText secondary={group.title} />
                        {group.items.map((item, key) => (
                            <ListItem key={key}>
                                <ListItemText primary={`${item.name} (${item.id})`} />
                            </ListItem>
                        ))}
                    </Fragment>
                ))}
            </List>
        </DrawerFormLayout>
    );
};

export default AppPlatformRevisionPreviewForm;
