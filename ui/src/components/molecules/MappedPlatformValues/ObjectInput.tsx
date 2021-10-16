import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import {
    MappedPlatformElementFormProps,
    MappedPlatformValuesForm,
} from './MappedPlatformValuesForm';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { VarType } from '../../../gql/generated/globalTypes';
import { buildDataMapLabel } from '../../../utils/DataMapUtils';

const useStyles = makeStyles((theme) => ({
    objectContainer: {
        width: '100%',
        borderRadius: '4px',
        border: '1px solid #e1e4e8',
    },
    label: {
        padding: theme.spacing(1),
    },
    labelDisabled: {
        padding: theme.spacing(1),
        color: 'rgba(0, 0, 0, 0.38)',
    },
    content: {
        borderTop: '1px solid #e1e4e8',
        display: 'flex',
    },
    add: {
        borderTop: '1px solid #e1e4e8',
        padding: theme.spacing(1),
    },
    objectElementContainer: {
        width: '100%',
        padding: theme.spacing(1),
        flexGrow: 1,
        '& div:last-child': {
            marginBottom: 0,
        },
    },
    closeButtonContainer: {
        borderLeft: '1px solid #e1e4e8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 0,
    },
}));

const ObjectInput: FC<MappedPlatformElementFormProps> = (props: MappedPlatformElementFormProps) => {
    const classes = useStyles();
    const { mappedPlatformElement, parentLocators, disabled, ...parentProps } = props;

    const canAdd =
        !disabled &&
        ((mappedPlatformElement.platformDataMap.var_type === VarType.OBJECT &&
            mappedPlatformElement.platformDataMap.is_optional &&
            mappedPlatformElement.children.length === 0) ||
            mappedPlatformElement.platformDataMap.var_type === VarType.ARRAY_OBJECT);

    return (
        <div className={classes.objectContainer}>
            <div className={disabled ? classes.labelDisabled : classes.label}>
                {buildDataMapLabel(mappedPlatformElement.platformDataMap.key)}
                {mappedPlatformElement.platformDataMap.is_optional || ' *'}
            </div>
            {mappedPlatformElement.children.map((platformDataObject, index) => (
                <div className={classes.content} key={index}>
                    <div className={classes.objectElementContainer}>
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
                    </div>
                    {!disabled &&
                        (mappedPlatformElement.platformDataMap.is_optional ||
                            mappedPlatformElement.children.length > 1) && (
                            <div className={classes.closeButtonContainer}>
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
                            </div>
                        )}
                </div>
            ))}

            {canAdd && (
                <div className={classes.add}>
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
                </div>
            )}
        </div>
    );
};

export default ObjectInput;
