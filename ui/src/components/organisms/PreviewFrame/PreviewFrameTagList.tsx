import { FC, useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Box, CircularProgress, ListItemText, useTheme } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { grey } from '@mui/material/colors';
import { previewFrameContext } from '../../../context/PreviewFrameContext';
import { RevisionStatus } from '../../../types/PreviewFrameTypes';

const useStyles = makeStyles((theme) => ({
    tagsSection: {
        borderRight: '1px solid #dadada',
        backgroundColor: '#ffffff',
        color: '#4c5053',
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    tagsList: {
        height: '100%',
        overflow: 'auto',
        flex: 1,
    },
    tagsTitle: {
        padding: theme.spacing(0, 2),
        paddingTop: '6px',
        fontWeight: 500,
        textTransform: 'uppercase',
        borderBottom: '1px solid #dadada',
        backgroundColor: '#eeeeee',
        color: '#4c5053',
        lineHeight: 1.75,
        height: '35px',
        fontSize: '0.8em',
        overflow: 'hidden',
    },
}));

const findTagIndex = (
    revisionStatus: RevisionStatus | undefined,
    tagCode: string | undefined,
): number => {
    if (revisionStatus === undefined) return 0;
    const loadedTags = revisionStatus.tags.filter((_) => _.tagCode.code === tagCode);
    if (loadedTags.length === 0) return 0;
    return loadedTags[0].tagCode.index;
};

const PreviewFrameTagList: FC = () => {
    const theme = useTheme();
    const classes = useStyles();
    const { revisionStatus, previewFrameData, currentTagCode, setCurrentTagCode, setGotoElement } =
        useContext(previewFrameContext);

    const errors = revisionStatus?.log.filter((_) => _.isError) ?? [];
    const hasError = (tagCode: string) => {
        return errors.some((_) => _.tagCode.code === tagCode);
    };

    return (
        <Box width="400px" height="100%" className={classes.tagsSection}>
            <Box className={classes.tagsTitle}>Tags</Box>

            {revisionStatus === undefined || previewFrameData === undefined ? (
                <Box
                    height="50px"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress color="inherit" size={20} />
                </Box>
            ) : (
                <List dense component="nav" className={classes.tagsList}>
                    {previewFrameData.getRevision.tags.map((_) => {
                        const currentTagHasStatus: boolean =
                            revisionStatus?.tags.find(
                                (tagStatus) => tagStatus.tagCode.code === _.tag_code,
                            ) !== undefined;

                        return (
                            <ListItem
                                button
                                key={_.id}
                                autoFocus={currentTagCode?.code === _.tag_code}
                                selected={currentTagCode?.code === _.tag_code}
                                onClick={() => {
                                    setCurrentTagCode({
                                        code: _.tag_code,
                                        index: findTagIndex(revisionStatus, _.tag_code),
                                    });
                                    setGotoElement(undefined);
                                }}
                            >
                                <ListItemText primary={_.name} />
                                {hasError(_.tag_code) && (
                                    <WarningIcon
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: theme.palette.error.main,
                                            margin: '3px',
                                        }}
                                    />
                                )}
                                {!currentTagHasStatus && (
                                    <ErrorOutlineIcon
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: grey[500],
                                            margin: '3px',
                                        }}
                                    />
                                )}
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};

export { PreviewFrameTagList };
