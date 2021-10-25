import { FC } from 'react';
import { Box, Divider } from '@mui/material';

type RuleContainerDividerProps = {
    text: string;
    dark?: boolean;
};

const RuleContainerDivider: FC<RuleContainerDividerProps> = (props: RuleContainerDividerProps) => {
    const { text } = props;

    return (
        <Box
            sx={{
                position: 'relative',
                textAlign: 'center',
                margin: (theme) => theme.spacing(5, 3),
            }}
        >
            <Divider />
            <Box
                sx={{
                    position: 'absolute',
                    padding: '0 5px',
                    marginTop: '-10px',
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    fontSize: '15px',
                    color: '#888888',
                    backgroundColor: props.dark ? '#f5f5f5' : 'white',
                }}
            >
                {text}
            </Box>
        </Box>
    );
};

export default RuleContainerDivider;
