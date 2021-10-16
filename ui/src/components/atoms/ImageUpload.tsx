import { ChangeEventHandler, Dispatch, FC, SetStateAction, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Avatar, Box, CircularProgress, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import clsx from 'clsx';
import CloseIcon from '@mui/icons-material/Close';

export type ImageUploadProps = {
    initialUrl?: string;
    label: string;
    removeImage: (setUrl: Dispatch<SetStateAction<string>>) => void;
    imageLoading: boolean;
    setImageLoading: Dispatch<SetStateAction<boolean>>;
    handleImageUpload: (
        selectedFile: File,
        setLoading: Dispatch<SetStateAction<boolean>>,
        setUrl: Dispatch<SetStateAction<string>>,
        setFetchError: Dispatch<SetStateAction<string | undefined>>,
    ) => void;
};

const useStyles = makeStyles((theme) => ({
    label: {
        marginTop: theme.spacing(1),
        fontSize: '0.9em',
    },
    input: {
        display: 'none',
    },
    loader: {
        marginLeft: theme.spacing(1),
    },
    square: {
        margin: theme.spacing(1, 1, 1, 0),
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    squareText: {
        color: theme.palette.getContrastText(grey[600]),
        backgroundColor: grey[600],
        fontSize: '12px',
        textAlign: 'center',
    },
    legend: {
        color: grey[800],
    },
    error: {
        color: theme.palette.error.main,
    },
    close: {
        fontSize: '16px',
        marginLeft: theme.spacing(1),
    },
}));

const ImageUpload: FC<ImageUploadProps> = (props: ImageUploadProps) => {
    const classes = useStyles();
    const { label, handleImageUpload, removeImage, initialUrl, setImageLoading, imageLoading } =
        props;

    const [url, setUrl] = useState(initialUrl === undefined ? '' : initialUrl);
    const [fetchError, setFetchError] = useState<string | undefined>(undefined);

    const handleFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFetchError(undefined);
        if (e.target.files !== null && e.target.files[0] !== undefined) {
            handleImageUpload(e.target.files[0], setImageLoading, setUrl, setFetchError);
        }
    };

    return (
        <>
            <label className={classes.label}>{label}</label>
            <input
                accept="image/jpeg,image/png"
                id="icon-button-file"
                type="file"
                className={classes.input}
                onChange={handleFileInput}
            />
            <label
                htmlFor="icon-button-file"
                onClick={() => {
                    setFetchError(undefined);
                }}
            >
                <Box display="flex" mt={2} alignItems="center">
                    <Avatar
                        className={clsx(classes.square, url === '' && classes.squareText)}
                        src={url === '' ? undefined : url}
                        variant="square"
                    >
                        {url === '' ? 'Select Logo' : ''}
                    </Avatar>
                    <small className={classes.legend}>(Square JPG or PNG, Max 32Kb)</small>
                    <IconButton
                        aria-label="delete"
                        onClick={() => {
                            removeImage(setUrl);
                        }}
                        size="small"
                        className={classes.close}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    {imageLoading && (
                        <CircularProgress size={10} className={classes.loader} color="inherit" />
                    )}
                </Box>
            </label>

            {fetchError !== undefined && <small className={classes.error}>{fetchError}</small>}
        </>
    );
};

export default ImageUpload;
