import { FC } from 'react';
import { Box } from '@mui/system';

const PricingInclude: FC<{ elements: string[] }> = (props: { elements: string[] }) => {
    return (
        <>
            <Box fontSize="20px" color="#666666" pb={2}>
                This plan includes:
            </Box>
            <Box
                component="ul"
                sx={{
                    margin: 0,
                    paddingLeft: (theme) => theme.spacing(2),
                    columnCount: 1,
                    '& li': {
                        fontSize: '16px',
                        lineHeight: '2em',
                    },
                }}
            >
                {props.elements.map((el, index) => (
                    <li key={index}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: el,
                            }}
                        />
                    </li>
                ))}
            </Box>
        </>
    );
};

export { PricingInclude };
