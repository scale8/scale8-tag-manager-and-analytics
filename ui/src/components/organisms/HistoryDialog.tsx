import { FC, ReactNode } from 'react';
import { DialogContent, DialogContentText, Paper } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { InfoButton, InfoProps } from '../molecules/InfoButton';
import InfoDialogTitle from '../molecules/InfoDialogTitle';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Typography from '@mui/material/Typography';
import {
    EntitiesHistory,
    EntitiesHistory_getHistoryForEntities,
} from '../../gql/generated/EntitiesHistory';
import { snakeToTitleCase } from '../../utils/TextUtils';
import { TimelineContent } from '@mui/lab';
import TimelineDot from '@mui/lab/TimelineDot';
import { timestampDisplay } from '../../utils/DateTimeUtils';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '700px',
        },
        paper: {
            padding: '6px 16px',
            marginBottom: theme.spacing(5),
        },
        comments: {
            marginTop: theme.spacing(1),
            fontSize: '0.9em',
            color: 'rgba(0, 0, 0, 0.54)',
        },
    }),
);

export type HistoryDialogProps = {
    handleDialogClose: (checkChanges: boolean) => void;
    title: string;
    formInfoProps?: InfoProps;
    historyData: EntitiesHistory;
};

type Audit = EntitiesHistory_getHistoryForEntities;

const HistoryDialog: FC<HistoryDialogProps> = (props: HistoryDialogProps) => {
    const classes = useStyles();

    const chooseDot = (action: string, method: string): ReactNode => {
        if (method === 'ADD_LINKED_ENTITY') {
            return (
                <TimelineDot color="inherit" variant="outlined">
                    <AddIcon />
                </TimelineDot>
            );
        }
        if (method === 'DELETE_LINKED_ENTITY') {
            return (
                <TimelineDot color="inherit" variant="outlined">
                    <DeleteIcon />
                </TimelineDot>
            );
        }
        if (action === 'Create') {
            return (
                <TimelineDot color="primary">
                    <AddIcon />
                </TimelineDot>
            );
        }
        if (action === 'Delete') {
            return (
                <TimelineDot color="primary">
                    <DeleteIcon />
                </TimelineDot>
            );
        }
        if (action === 'Clone') {
            return (
                <TimelineDot color="primary">
                    <FileCopyIcon />
                </TimelineDot>
            );
        }

        return (
            <TimelineDot color="primary">
                <EditIcon />
            </TimelineDot>
        );
    };

    return (
        <>
            <InfoDialogTitle handleDialogClose={props.handleDialogClose}>
                {props.title}
                {props.formInfoProps !== undefined && <InfoButton {...props.formInfoProps} />}
            </InfoDialogTitle>
            <DialogContent
                style={{
                    margin: 0,
                    padding: 0,
                }}
                dividers
            >
                <div className={classes.root}>
                    <DialogContent>
                        <DialogContentText component="div" id="alert-dialog-description">
                            <Timeline position="alternate">
                                {props.historyData.getHistoryForEntities.map(
                                    (audit: Audit, index) => (
                                        <TimelineItem key={audit.id}>
                                            <TimelineOppositeContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    {}
                                                    {timestampDisplay(audit.created_at as number)}
                                                </Typography>
                                            </TimelineOppositeContent>

                                            <TimelineSeparator>
                                                {chooseDot(audit.action, audit.method)}
                                                {index <
                                                    props.historyData.getHistoryForEntities.length -
                                                        1 && <TimelineConnector />}
                                            </TimelineSeparator>

                                            <TimelineContent>
                                                <Paper elevation={3} className={classes.paper}>
                                                    <Typography variant="h6" component="h1">
                                                        {audit.user === null
                                                            ? 'System'
                                                            : `${audit.user.first_name} ${audit.user.last_name}`}
                                                    </Typography>
                                                    <Typography>
                                                        {snakeToTitleCase(audit.method)}
                                                        {audit.connected_models.length > 0 && (
                                                            <span>
                                                                {' '}
                                                                - {audit.connected_models[0].type}
                                                            </span>
                                                        )}
                                                    </Typography>
                                                    {audit.comments !== '' &&
                                                        audit.comments !== null && (
                                                            <Typography
                                                                className={classes.comments}
                                                            >
                                                                {audit.comments}
                                                            </Typography>
                                                        )}
                                                </Paper>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ),
                                )}
                            </Timeline>
                        </DialogContentText>
                    </DialogContent>
                </div>
            </DialogContent>
        </>
    );
};

export default HistoryDialog;
