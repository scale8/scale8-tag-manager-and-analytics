import { ChangeEventHandler, Dispatch, FC, SetStateAction, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
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

const ImageUpload: FC<ImageUploadProps> = ({
    label,
    handleImageUpload,
    removeImage,
    initialUrl,
    setImageLoading,
    imageLoading,
}) => {
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
            <Box component="label" sx={{ marginTop: 1, fontSize: '0.9em' }}>
                {label}
            </Box>
            <Box
                sx={{ display: 'none' }}
                component="input"
                accept="image/jpeg,image/png"
                id="icon-button-file"
                type="file"
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
                        sx={{
                            margin: (theme) => theme.spacing(1, 1, 1, 0),
                            width: (theme) => theme.spacing(7),
                            height: (theme) => theme.spacing(7),
                            ...(url === ''
                                ? {
                                      color: (theme) => theme.palette.getContrastText(grey[600]),
                                      backgroundColor: grey[600],
                                      fontSize: '12px',
                                      textAlign: 'center',
                                  }
                                : {}),
                        }}
                        src={url === '' ? undefined : url}
                        variant="square"
                    >
                        {url === '' ? 'Select Logo' : ''}
                    </Avatar>
                    <Box component="small" sx={{ color: grey[800] }}>
                        (Square JPG or PNG, Max 32Kb)
                    </Box>
                    <IconButton
                        aria-label="delete"
                        onClick={() => {
                            removeImage(setUrl);
                        }}
                        size="small"
                        sx={{
                            fontSize: '16px',
                            marginLeft: 1,
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    {imageLoading && (
                        <CircularProgress size={10} sx={{ marginLeft: 1 }} color="inherit" />
                    )}
                </Box>
            </label>

            {fetchError !== undefined && (
                <Box
                    component="small"
                    sx={{
                        color: (theme) => theme.palette.error.main,
                    }}
                >
                    {fetchError}
                </Box>
            )}
        </>
    );
};

export default ImageUpload;
