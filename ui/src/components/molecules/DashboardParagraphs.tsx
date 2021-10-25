import { FC } from 'react';
import { Typography } from '@mui/material';

export type DashboardParagraphsProps = {
    paragraphs: (() => JSX.Element)[];
};

const DashboardParagraphs: FC<DashboardParagraphsProps> = (props: DashboardParagraphsProps) => {
    return (
        <>
            {props.paragraphs.map((paragraphComponent, pIndex) => (
                <Typography key={pIndex}>{paragraphComponent()}</Typography>
            ))}
        </>
    );
};

export { DashboardParagraphs };
