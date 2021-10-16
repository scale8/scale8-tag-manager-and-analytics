import { MouseEventHandler } from 'react';
import { FC } from 'react';
import { Box, Button, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

type LoginSsoProps = {
    handleGithubButtonClick: MouseEventHandler;
};

const LoginSso: FC<LoginSsoProps> = (props: LoginSsoProps) => {
    return (
        <Box pt={4} width="100%">
            <Divider />
            <Box
                fontSize={11}
                style={{ textAlign: 'center' }}
                width="100px"
                m="auto"
                bgcolor="background.paper"
                color="grey.500"
                mt="-8px"
            >
                OR LOG IN WITH
            </Box>
            <Box mt={3} display="flex" justifyContent="center">
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={props.handleGithubButtonClick}
                    startIcon={<GitHubIcon />}
                >
                    Github
                </Button>
            </Box>
        </Box>
    );
};

export default LoginSso;
