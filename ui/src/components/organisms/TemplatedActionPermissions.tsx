import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { TemplatedActionFormProps } from '../../types/props/forms/TemplatedActionFormProps';
import { Alert } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import { PlatformActionPermissionInput } from '../../types/ActionPermissionsTypes';
import { PlatformActionPermissionRequest } from '../../gql/generated/globalTypes';
import GlobalVariableActionPermission from '../molecules/ActionPermissions/GlobalVariableActionPermission';
import EmitEventActionPermission from '../molecules/ActionPermissions/EmitEventActionPermission';
import LogToConsoleActionPermission from '../molecules/ActionPermissions/LogToConsoleActionPermission';
import DataLayerActionPermission from '../molecules/ActionPermissions/DataLayerActionPermission';
import CookieActionPermission from '../molecules/ActionPermissions/CookieActionPermission';
import DocumentCharSetActionPermission from '../molecules/ActionPermissions/DocumentCharSetActionPermission';
import PageTitleActionPermission from '../molecules/ActionPermissions/PageTitleActionPermission';
import LocalStorageActionPermission from '../molecules/ActionPermissions/LocalStorageActionPermission';
import InjectJsActionPermission from '../molecules/ActionPermissions/InjectJsActionPermission';
import CreateIFrameActionPermission from '../molecules/ActionPermissions/CreateIFrameActionPermission';
import PixelActionPermission from '../molecules/ActionPermissions/PixelActionPermission';
import ReadPageUrlActionPermission from '../molecules/ActionPermissions/ReadPageUrlActionPermission';
import ReadReferrerUrlActionPermission from '../molecules/ActionPermissions/ReadReferrerUrlActionPermission';
import IconAlignedAlert from '../atoms/IconAlignedAlert';

type TemplatedActionPermissionsProps = TemplatedActionFormProps & {
    permissionInfoOpen: boolean;
    setPermissionInfoOpen: Dispatch<SetStateAction<boolean>>;
};

const TemplatedActionPermissions: FC<TemplatedActionPermissionsProps> = (
    props: TemplatedActionPermissionsProps,
) => {
    const { permissionInfoOpen, setPermissionInfoOpen } = props;

    const validationError = props.errors['permissionRequests'];

    const activePermissionRequests = props.values.permissionRequests.filter(
        (_: PlatformActionPermissionInput) => _.active,
    );

    const updatePermission = (
        oldPermission: PlatformActionPermissionInput,
        newPermission: PlatformActionPermissionInput,
    ) => {
        props.handleChange(
            'permissionRequests',
            props.values.permissionRequests.map((_: PlatformActionPermissionInput) => {
                if (_.permission === oldPermission.permission) {
                    return newPermission;
                } else {
                    return _;
                }
            }),
        );
    };

    const selectPermission = (permission: PlatformActionPermissionInput): ReactNode => {
        switch (permission.permission) {
            case PlatformActionPermissionRequest.LOG_TO_CONSOLE:
                return <LogToConsoleActionPermission />;
            case PlatformActionPermissionRequest.READ_DOCUMENT_CHARACTER_SET:
                return <DocumentCharSetActionPermission />;
            case PlatformActionPermissionRequest.READ_PAGE_TITLE:
                return <PageTitleActionPermission />;
            case PlatformActionPermissionRequest.GLOBAL_VARIABLE:
                return (
                    <GlobalVariableActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.DATA_LAYER:
                return (
                    <DataLayerActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.COOKIE:
                return (
                    <CookieActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.LOCAL_STORAGE:
                return (
                    <LocalStorageActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.EMIT_EVENT:
                return (
                    <EmitEventActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.INJECT_JAVASCRIPT:
                return (
                    <InjectJsActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.CREATE_IFRAME:
                return (
                    <CreateIFrameActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.IMAGE_PIXEL:
                return (
                    <PixelActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                    />
                );
            case PlatformActionPermissionRequest.READ_PAGE_URL:
                return (
                    <ReadPageUrlActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                        hasError={
                            validationError !== undefined &&
                            props.values.permissionRequests.find((_) => {
                                if (
                                    _.permission === PlatformActionPermissionRequest.READ_PAGE_URL
                                ) {
                                    return _.urlParts === undefined || _.urlParts.length === 0;
                                }
                                return false;
                            }) !== undefined
                        }
                    />
                );
            case PlatformActionPermissionRequest.READ_REFERRER_URL:
                return (
                    <ReadReferrerUrlActionPermission
                        permission={permission}
                        updatePermission={updatePermission}
                        readOnly={props.readOnly}
                        hasError={
                            validationError !== undefined &&
                            props.values.permissionRequests.find((_) => {
                                if (
                                    _.permission ===
                                    PlatformActionPermissionRequest.READ_REFERRER_URL
                                ) {
                                    return _.urlParts === undefined || _.urlParts.length === 0;
                                }
                                return false;
                            }) !== undefined
                        }
                    />
                );
            default:
                return (
                    <Alert severity="error">
                        The permission &quot;{permission.permission}&quot; is not supported yet.
                    </Alert>
                );
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
            <Collapse in={!props.readOnly && permissionInfoOpen}>
                <IconAlignedAlert
                    sx={{
                        borderRadius: 0,
                        borderBottom: '1px solid #e1e4e8',
                    }}
                    onClose={() => {
                        setPermissionInfoOpen(false);
                    }}
                    severity="info"
                >
                    Permissions are automatically detected based on APIs used in the Code tab.{' '}
                    <br />
                    Use this tab to set limitations on the detected permissions.
                </IconAlignedAlert>
            </Collapse>

            {activePermissionRequests.length === 0 && (
                <Box sx={{ width: '100%', padding: 1, display: 'flex', alignItems: 'center' }}>
                    <Alert icon={false} color="info" sx={{ width: '100%' }}>
                        No Permissions Defined
                    </Alert>
                </Box>
            )}

            {activePermissionRequests.map((permission: PlatformActionPermissionInput) => (
                <Box p={2} borderBottom="1px solid #e1e4e8;" key={permission.permission}>
                    {selectPermission(permission)}
                </Box>
            ))}
        </Box>
    );
};

export default TemplatedActionPermissions;
