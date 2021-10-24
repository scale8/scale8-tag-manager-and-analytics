import { FC } from 'react';
import { SignUpContainerProps } from '../molecules/SignUpContainer';
import { Step, StepLabel, Stepper } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

const SignUpProgress: FC<Omit<SignUpContainerProps, 'children'>> = (
    props: Omit<SignUpContainerProps, 'children'>,
) => {
    const { type, isCompleted, isPrepare } = props;

    const selectActiveStep = () => {
        if (isPrepare) return 2;
        if (isCompleted) return 1;
        return 0;
    };

    const stepLabelStyle: SxProps<Theme> = {
        '& .MuiStepLabel-active, & .MuiStepLabel-completed': {
            color: (theme) => {
                if (type === 'tag-manager') {
                    return `${theme.palette.tagManagerColor.main} !important`;
                }

                if (type === 'data-manager') {
                    return `${theme.palette.dataManagerColor.main} !important`;
                }

                return `${theme.palette.commonColor.main} !important`;
            },
        },
    };

    return (
        <div>
            <Stepper activeStep={selectActiveStep()} color="red">
                <Step>
                    <StepLabel sx={stepLabelStyle}>Create Account</StepLabel>
                </Step>
                <Step>
                    <StepLabel sx={stepLabelStyle}>Confirm Email</StepLabel>
                </Step>
                <Step>
                    <StepLabel sx={stepLabelStyle}>
                        {type === 'tag-manager' ? 'Install Tags' : 'Prepare Account'}
                    </StepLabel>
                </Step>
            </Stepper>
        </div>
    );
};

export default SignUpProgress;
