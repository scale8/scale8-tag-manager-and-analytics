import { FC } from 'react';
import { Typography } from '@material-ui/core';

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
