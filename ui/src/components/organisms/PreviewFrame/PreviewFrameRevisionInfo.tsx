import { ChangeEvent, FC, useContext } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { PreviewFrameErrorsList } from './PreviewFrameErrorsList';
import { PreviewFrameDataLayers } from './PreviewFrameDataLayers';
import { TabularData } from '../../molecules/TabularData';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

const useStyles = makeStyles(() => ({
    appBar: {
        minHeight: '34px',
        borderBottom: '1px solid #dadada',
    },
    tabs: {
        minHeight: '34px',
    },
    tab: {
        minHeight: '34px',
        fontSize: '0.8em',
    },
}));

const PreviewFrameRevisionInfo: FC = () => {
    const classes = useStyles();
    const { revisionStatus, previewFrameData, setRevisionTab, revisionTab } =
        useContext(previewFrameContext);

    const handleChange = (event: ChangeEvent<any>, newValue: number) => {
        setRevisionTab(newValue);
    };

    const errors = revisionStatus?.log.filter((_) => _.isError) ?? [];

    return (
        <Box width="100%" height="100%" bgcolor="#ffffff">
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
                <Box display="flex" flexDirection="column" height="100%">
                    <AppBar
                        position="static"
                        color="default"
                        className={classes.appBar}
                        elevation={0}
                    >
                        <Tabs
                            value={revisionTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                            className={classes.tabs}
                        >
                            <Tab className={classes.tab} label="Data Layers " />
                            <Tab className={classes.tab} label="Revision" />
                            <Tab className={classes.tab} label="Platform" />
                            {errors.length > 0 && <Tab className={classes.tab} label="Errors" />}
                        </Tabs>
                    </AppBar>
                    {revisionTab === 0 && (
                        <Box p={1} overflow="auto" flexGrow={0} height="100%">
                            <PreviewFrameDataLayers />
                        </Box>
                    )}
                    {revisionTab === 1 && (
                        <Box p={1} overflow="auto" flexGrow={0} height="100%">
                            <TabularData
                                source={[
                                    ['Application', previewFrameData.getApp.name],
                                    ['Application Id', previewFrameData.getApp.id],
                                    ['Revision', previewFrameData.getRevision.name],
                                    ['Revision Id', previewFrameData.getRevision.id],
                                    [
                                        'Revision Locked',
                                        previewFrameData.getRevision.locked ? 'yes' : 'no',
                                    ],
                                ]}
                            />
                        </Box>
                    )}
                    {revisionTab === 2 && (
                        <Box p={1} overflow="auto" flexGrow={0} height="100%">
                            <TabularData
                                source={[
                                    ['Platform Id', revisionStatus.platformId],
                                    ['Server', revisionStatus.server],
                                    ['Country Code', revisionStatus.countryCode],
                                    [
                                        'Subdivision Codes',
                                        revisionStatus.subdivisionCodes.length > 0
                                            ? revisionStatus.subdivisionCodes.join(', ')
                                            : '-',
                                    ],
                                ]}
                            />
                        </Box>
                    )}
                    {revisionTab === 3 && (
                        <Box p={1} overflow="auto" flexGrow={0} height="100%">
                            <PreviewFrameErrorsList />
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export { PreviewFrameRevisionInfo };
