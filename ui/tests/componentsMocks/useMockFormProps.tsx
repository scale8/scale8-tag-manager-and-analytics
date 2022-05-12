import { FormValues, useFormValidation } from '../../src/hooks/form/useFormValidation';

export const useMockFormProps = <V extends FormValues>(formInitialState: V) => {
    const formValidationValues = useFormValidation<V>(formInitialState, [], async () => {
        //idle
    });

    return {
        ...formValidationValues,
        handleSubmit: () => {
            //idle
        },
        handleDialogClose: () => {
            //idle
        },
        title: 'mock form',
    };
};

export const platformDataFormResultProps = {
    handlePlatformDataChange: () => {
        //idle
    },
    addArrayElement: () => {
        //idle
    },
    removeArrayElement: () => {
        //idle
    },
    addObject: () => {
        //idle
    },
    removeObject: () => {
        //idle
    },
};
