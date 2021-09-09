import { Dispatch, SetStateAction } from 'react';
import { getApiUrl } from './ConfigUtils';

const uploadPlatformImage = (
    selectedFile: File,
    accountId: string,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setUrl: Dispatch<SetStateAction<string>>,
    setFetchError: Dispatch<SetStateAction<string | undefined>>,
    setFilename: (fileName: string) => void,
): void => {
    const uid = localStorage.getItem('uid') ?? '';
    const token = localStorage.getItem('token') ?? '';
    (async () => {
        try {
            setLoading(true);
            const response = await fetch(`${getApiUrl()}/rest/platform-image-upload`, {
                method: 'POST',
                headers: {
                    token,
                    uid,
                    'X-S8-ImageType': selectedFile.type,
                    'X-S8-AccountId': accountId,
                },
                body: selectedFile,
                redirect: 'follow',
            });
            const data = await response.json();

            if (data.success) {
                setFilename(data.fileName);
                setUrl(data.url);
                setFetchError(undefined);
            } else {
                setFetchError(
                    data.error !== undefined
                        ? data.error
                        : 'There was an error loading the image, please try again later.',
                );
            }
        } catch (e) {
            setFetchError('There was an error loading the image, please try again later.');
        } finally {
            setLoading(false);
        }
    })();
};

export { uploadPlatformImage };
