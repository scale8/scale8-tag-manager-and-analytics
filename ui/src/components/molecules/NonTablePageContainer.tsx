import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactNode } from 'react';
import PageTitle, { PageTitleProps } from '../molecules/PageTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 2, 4, 2),
    },
    section: {},
}));

const NonTablePageContainer: FC<PageTitleProps> = (
    props: PageTitleProps & { children?: ReactNode },
) => {
    const classes = useStyles();

    const { children, ...titleProps } = props;

    return (
        <div className={classes.root}>
            <PageTitle {...titleProps} />
            <div className={classes.section}>{children}</div>
        </div>
    );
};

export default NonTablePageContainer;
