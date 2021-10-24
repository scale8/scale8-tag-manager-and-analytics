import { ChangeEvent, FC } from 'react';
import { UpdateActionPermissionProps } from '../ActionPermissions/ActionPermissionSection';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
} from '@mui/material';
import { PlatformActionPermissionURLParts } from '../../../gql/generated/globalTypes';

const UrlPartsTable: FC<UpdateActionPermissionProps> = (props: UpdateActionPermissionProps) => {
    const { permission, updatePermission, readOnly } = props;

    const checkChecked = (part: PlatformActionPermissionURLParts): boolean => {
        if (permission.urlParts === undefined) {
            return false;
        }
        return permission.urlParts.includes(part);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const prevParts = permission.urlParts ?? [];
        if (event.target.checked) {
            updatePermission(permission, {
                ...permission,
                urlParts: [...prevParts, event.target.name as PlatformActionPermissionURLParts],
            });
        } else {
            updatePermission(permission, {
                ...permission,
                urlParts: prevParts.filter((_) => _ !== event.target.name),
            });
        }
    };

    return (
        <>
            <Box
                mt={3}
                sx={{
                    color: (theme) =>
                        props.hasError ? theme.palette.error.main : theme.palette.secondary.main,
                }}
            >
                URL Parts
            </Box>
            <Box sx={{ display: 'flex', '& fieldset': { marginTop: 0 } }}>
                <FormControl error={props.hasError} component="fieldset" sx={{ margin: 3 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkChecked(
                                        PlatformActionPermissionURLParts.FRAGMENT,
                                    )}
                                    onChange={handleChange}
                                    name="FRAGMENT"
                                    disabled={readOnly}
                                />
                            }
                            label="Fragment"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkChecked(PlatformActionPermissionURLParts.HOST)}
                                    onChange={handleChange}
                                    name="HOST"
                                    disabled={readOnly}
                                />
                            }
                            label="Host"
                        />
                    </FormGroup>
                    <FormHelperText>Select at least one.</FormHelperText>
                </FormControl>
                <FormControl component="fieldset" sx={{ margin: 3 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkChecked(PlatformActionPermissionURLParts.PATH)}
                                    onChange={handleChange}
                                    name="PATH"
                                    disabled={readOnly}
                                />
                            }
                            label="Path"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkChecked(
                                        PlatformActionPermissionURLParts.PROTOCOL,
                                    )}
                                    onChange={handleChange}
                                    name="PROTOCOL"
                                    disabled={readOnly}
                                />
                            }
                            label="Protocol"
                        />
                    </FormGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ margin: 3 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkChecked(PlatformActionPermissionURLParts.QUERY)}
                                    onChange={handleChange}
                                    name="QUERY"
                                    disabled={readOnly}
                                />
                            }
                            label="Query"
                        />
                    </FormGroup>
                </FormControl>
            </Box>
        </>
    );
};

export default UrlPartsTable;
