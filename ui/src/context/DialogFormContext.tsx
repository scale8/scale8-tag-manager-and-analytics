import { createContext, ReactNode, useContext } from 'react';
import { FormFieldProps, FormValues } from '../hooks/form/useFormValidation';

const DialogFormContext = createContext<FormFieldProps<any> | null>(null);

type AppContextProviderProps<T extends FormValues> = {
    children: ReactNode;
    formProps: FormFieldProps<T>;
};

export const DialogFormContextProvider = <T extends FormValues>({
    children,
    formProps,
}: AppContextProviderProps<T>) => {
    return <DialogFormContext.Provider value={formProps}>{children}</DialogFormContext.Provider>;
};

export const useDialogFormContext = () => {
    const context = useContext(DialogFormContext);
    if (context === null) {
        throw new Error('useDialogFormContext must be used within a DialogFormContextProvider');
    }
    return context;
};
