import { FC } from 'react';
import {
    MappedPlatformElementFormProps,
    MappedPlatformValuesForm,
} from './MappedPlatformValuesForm';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { VarType } from '../../../gql/generated/globalTypes';
import { buildDataMapLabel } from '../../../utils/DataMapUtils';

const ObjectInput: FC<MappedPlatformElementFormProps> = (props: MappedPlatformElementFormProps) => {
    const { mappedPlatformElement, parentLocators, disabled, ...parentProps } = props;

    const canAdd =
        !disabled &&
        ((mappedPlatformElement.platformDataMap.var_type === VarType.OBJECT &&
            mappedPlatformElement.platformDataMap.is_optional &&
            mappedPlatformElement.children.length === 0) ||
            mappedPlatformElement.platformDataMap.var_type === VarType.ARRAY_OBJECT);

    return (
        <Box sx={{ width: '100%', borderRadius: '4px', border: '1px solid #e1e4e8' }}>
            <Box sx={{ color: disabled ? 'rgba(0, 0, 0, 0.38)' : undefined, padding: 1 }}>
                {buildDataMapLabel(mappedPlatformElement.platformDataMap.key)}
                {mappedPlatformElement.platformDataMap.is_optional || ' *'}
            </Box>
            {mappedPlatformElement.children.map((platformDataObject, index) => (
                <Box sx={{ borderTop: '1px solid #e1e4e8', display: 'flex' }} key={index}>
                    <Box
                        sx={{
                            width: '100%',
                            padding: 1,
                            flexGrow: 1,
                            '& div:last-of-type': { marginBottom: 0 },
                        }}
                    >
                        <MappedPlatformValuesForm
                            {...parentProps}
                            mappedPlatformValues={platformDataObject}
                            parentLocators={[
                                ...parentLocators,
                                {
                                    id: mappedPlatformElement.platformDataMap.id,
                                    index,
                                },
                            ]}
                            disabled={disabled}
                        />
                    </Box>
                    {!disabled &&
                        (mappedPlatformElement.platformDataMap.is_optional ||
                            mappedPlatformElement.children.length > 1) && (
                            <Box
                                sx={{
                                    borderLeft: '1px solid #e1e4e8',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexGrow: 0,
                                }}
                            >
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                        props.removeObject(
                                            mappedPlatformElement.platformDataMap.id,
                                            index,
                                            props.parentLocators,
                                        );
                                    }}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                </Box>
            ))}

            {canAdd && (
                <Box sx={{ borderTop: '1px solid #e1e4e8', padding: 1 }}>
                    <IconButton
                        aria-label="add"
                        onClick={() => {
                            props.addObject(
                                mappedPlatformElement.platformDataMap.id,
                                props.parentLocators,
                            );
                        }}
                        size="small"
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default ObjectInput;
