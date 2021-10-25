import { FC, ReactNode } from 'react';
import { Box, Divider } from '@mui/material';

type RuleDescriptionProps = {
    main: string;
    secondary: string;
    children: ReactNode;
};

const RuleSection: FC<RuleDescriptionProps> = (props: RuleDescriptionProps) => {
    const { main, secondary } = props;

    return (
        <>
            <Box paddingBottom="16px" fontSize="18px" fontWeight="bold">
                {main}{' '}
                <Box component="span" fontSize="15px" color="#888888" fontWeight="normal">
                    {secondary}
                </Box>
                <Divider />
            </Box>
            <Box paddingLeft={2}>{props.children}</Box>
        </>
    );
};

export default RuleSection;
