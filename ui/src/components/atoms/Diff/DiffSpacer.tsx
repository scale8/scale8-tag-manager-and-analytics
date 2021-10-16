import { FC } from 'react';

import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

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
