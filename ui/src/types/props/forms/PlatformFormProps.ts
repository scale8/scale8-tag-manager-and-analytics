import { FormProps } from '../../../hooks/form/useFormValidation';
import { Dispatch, SetStateAction } from 'react';
import { PlatformValues } from '../../../utils/forms/PlatformFormUtils';

export type PlatformFormProps = FormProps<PlatformValues> & {
    initialUrl?: string;
    isUpdate?: boolean;
    removeImage: (setUrl: Dispatch<SetStateAction<string>>) => void;
    handleImageUpload: (
        selectedFile: File,
        setLoading: Dispatch<SetStateAction<boolean>>,
        setUrl: Dispatch<SetStateAction<string>>,
        setFetchError: Dispatch<SetStateAction<string | undefined>>,
    ) => void;
};
