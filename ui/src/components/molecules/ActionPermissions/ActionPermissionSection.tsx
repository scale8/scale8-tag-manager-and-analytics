import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { PlatformActionPermissionInput } from '../../../types/ActionPermissionsTypes';

export type UpdateActionPermissionProps = {
    permission: PlatformActionPermissionInput;
    updatePermission: (
        oldPermission: PlatformActionPermissionInput,
        newPermission: PlatformActionPermissionInput,
    ) => void;
    readOnly: boolean;
    hasError?: boolean;
};

type ActionPermissionSectionProps = {
    title: string;
    subtitle?: string;
    children?: ReactNode;
};

const ActionPermissionSection: FC<ActionPermissionSectionProps> = (
    props: ActionPermissionSectionProps,
) => {
    return (
        <Box mb={1}>
            <Typography variant="subtitle1">{props.title}</Typography>
            {props.subtitle !== undefined && (
                <Typography variant="subtitle2" color="textSecondary">
                    {props.subtitle}
                </Typography>
            )}
            {props.children === undefined ? null : props.children}
        </Box>
    );
};

export default ActionPermissionSection;
