import { FC } from 'react';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { InfoButton, InfoProps } from './InfoButton';

const useStyles = makeStyles((theme) => ({
    title: {
        display: 'flex',
        alignItems: 'center',
        minHeight: theme.spacing(8),
    },
}));

export type PageTitleProps = InfoProps & {
    title: string;
};

const PageTitle: FC<PageTitleProps> = (props: PageTitleProps) => {
    const classes = useStyles();

    const { title, ...infoProps } = props;

    return (
        <div className={classes.title}>
            <Typography variant="h6" id="tableTitle" component="div">
                {title} <InfoButton {...infoProps} />
            </Typography>
        </div>
    );
};

export default PageTitle;
