import { FC, useState } from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

const PricingInclude: FC<{ elements: string[]; moreAfter: number }> = (props: {
    elements: string[];
    moreAfter: number;
}) => {
    const [showAll, setShowAll] = useState(false);

    const elements = showAll ? props.elements : props.elements.slice(0, props.moreAfter);

    return (
        <>
            <Box fontWeight="bold" pb={2}>
                This plan includes:
            </Box>
            <Box
                component="ul"
                sx={{
                    margin: (theme) => theme.spacing(0, 0, 1, 0),
                    paddingLeft: (theme) => theme.spacing(2),
                    columnCount: 1,
                    '& li': {
                        lineHeight: '1.5em',
                    },
                }}
            >
                {elements.map((el, index) => (
                    <li key={index}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: el,
                            }}
                        />
                    </li>
                ))}
            </Box>
            <Button
                onClick={() => setShowAll(!showAll)}
                startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                size="small"
            >
                {showAll ? 'Show Less' : 'Show More'}
            </Button>
        </>
    );
};

export { PricingInclude };
