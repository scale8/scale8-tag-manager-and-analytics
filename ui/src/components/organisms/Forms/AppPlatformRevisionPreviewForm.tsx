import { FC, Fragment } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { FormBaseProps } from '../../../types/props/forms/CommonFormProps';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { DialogContentText, List, ListItem, ListItemText } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppPlatformRevisionValues } from '../../../dialogPages/tagManager/app/LinkPlatformRevision';

const useStyles = makeStyles((theme) =>
    createStyles({
        list: {
            padding: theme.spacing(0, 2),
        },
    }),
);

export type AppPlatformRevisionPreviewProps = FormValidationResult<AppPlatformRevisionValues> &
    FormBaseProps & {
        revisionName: string;
        groups: { title: string; items: { name: string; id: string }[] }[];
    };

const AppPlatformRevisionPreviewForm: FC<AppPlatformRevisionPreviewProps> = (
    props: AppPlatformRevisionPreviewProps,
) => {
    const classes = useStyles();

    return (
        <DrawerFormLayout {...props}>
            <DialogContentText id="alert-dialog-description">
                {props.groups.length === 0
                    ? `Change to Revision: ${props.revisionName}?`
                    : `Changing to Revision "${props.revisionName}" will require the removal of:`}
            </DialogContentText>
            <List dense className={classes.list}>
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
