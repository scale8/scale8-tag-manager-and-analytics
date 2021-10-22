import { FC } from 'react';
import { Grid } from '@mui/material';
import { useConfigState } from '../../context/AppContext';
import { toRequestPasswordReset, toSignUp } from '../../utils/NavigationPaths';
import Link from '../atoms/Next/Link';

const LoginLinks: FC = () => {
    const { useSignup } = useConfigState();

    return (
        <Grid container>
            <Grid item xs>
                <Link href={toRequestPasswordReset()} variant="body2">
                    Forgot password?
                </Link>
            </Grid>
            {useSignup && (
                <Grid item>
                    <Link href={toSignUp()} variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            )}
        </Grid>
    );
};

export default LoginLinks;
