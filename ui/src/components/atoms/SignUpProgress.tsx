import { FC } from 'react';
import { SignUpContainerProps } from '../molecules/SignUpContainer';
import makeStyles from '@mui/styles/makeStyles';
import { Step, StepLabel, Stepper } from '@mui/material';

const useTagManagerStyles = makeStyles((theme) => ({
    active: {
        color: `${theme.palette.tagManagerColor.main} !important`,
    },
    completed: {
        color: `${theme.palette.tagManagerColor.main} !important`,
    },
}));
const useDataManagerStyles = makeStyles((theme) => ({
    active: {
        color: `${theme.palette.dataManagerColor.main} !important`,
    },
    completed: {
        color: `${theme.palette.dataManagerColor.main} !important`,
    },
}));
const useInviteStyles = makeStyles((theme) => ({
    active: {
        color: `${theme.palette.commonColor.main} !important`,
    },
    completed: {
        color: `${theme.palette.commonColor.main} !important`,
    },
}));

const SignUpProgress: FC<Omit<SignUpContainerProps, 'children'>> = (
    props: Omit<SignUpContainerProps, 'children'>,
) => {
    const { type, isCompleted, isPrepare } = props;
    const selectClasses = () => {
        if (type === 'tag-manager') {
            return useTagManagerStyles();
        }

        if (type === 'data-manager') {
            return useDataManagerStyles();
        }

        return useInviteStyles();
    };
    const classes = selectClasses();

    const selectActiveStep = () => {
        if (isPrepare) return 2;
        if (isCompleted) return 1;
        return 0;
    };

    return (
        <div>
            <Stepper activeStep={selectActiveStep()} color="red">
                <Step>
                    <StepLabel
                        StepIconProps={{
                            classes: {
                                active: classes.active,
                                completed: classes.completed,
                            },
                        }}
                    >
                        Create Account
                    </StepLabel>
                </Step>
                <Step>
                    <StepLabel
                        StepIconProps={{
                            classes: {
                                active: classes.active,
                                completed: classes.completed,
                            },
                        }}
                    >
                        Confirm Email
                    </StepLabel>
                </Step>
                <Step>
                    <StepLabel
                        StepIconProps={{
                            classes: {
                                active: classes.active,
                                completed: classes.completed,
                            },
                        }}
                    >
                        {type === 'tag-manager' ? 'Install Tags' : 'Prepare Account'}
                    </StepLabel>
                </Step>
            </Stepper>
        </div>
    );
};

export default SignUpProgress;
