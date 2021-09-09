import { FC } from 'react';

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type SpacerProps = {
    height: number;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: (props: SpacerProps) => theme.spacing(props.height),
        },
    }),
);

const DiffSpacer: FC<SpacerProps> = (props: SpacerProps) => {
    const classes = useStyles(props);
    return <div className={classes.root} />;
};

export default DiffSpacer;
