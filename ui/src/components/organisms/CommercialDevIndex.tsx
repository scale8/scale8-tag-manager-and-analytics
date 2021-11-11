import { ReactElement } from 'react';
import { Box, Button } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { toLogin, toSignUp } from '../../utils/NavigationPaths';

const CommercialDevIndex = (): ReactElement => {
    const router = useRouter();

    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            {[
                {
                    text: 'Login',
                    color: (theme: Theme) => theme.palette.commonColor.main,
                    target: toLogin,
                },
                {
                    text: 'Tag Manager Sign Up',
                    color: (theme: Theme) => theme.palette.tagManagerColor.main,
                    target: toSignUp({ type: 'tag-manager' }),
                },
                {
                    text: 'Data Manager Sign Up',
                    color: (theme: Theme) => theme.palette.dataManagerColor.main,
                    target: toSignUp({ type: 'data-manager' }),
                },
            ].map((_) => (
                <Box mt={4} width={400} key={_.text}>
                    <Button
                        sx={{
                            fontSize: 18,
                            padding: (theme) => theme.spacing(1.5),
                            backgroundColor: _.color,
                            '&:hover': {
                                backgroundColor: _.color,
                            },
                        }}
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            router.push(_.target);
                        }}
                    >
                        {_.text}
                    </Button>
                </Box>
            ))}
        </Box>
    );
};

export default CommercialDevIndex;
