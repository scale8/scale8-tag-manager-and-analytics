import { ChangeEvent, FC, useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import { PreviewFrameErrorsList } from './PreviewFrameErrorsList';
import { PreviewFrameDataLayers } from './PreviewFrameDataLayers';
import { TabularData } from '../../molecules/TabularData';
import { previewFrameContext } from '../../../context/PreviewFrameContext';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

const PreviewFrameRevisionInfo: FC = () => {
    const tabStyle: SxProps<Theme> = {
        minHeight: '34px',
        fontSize: '0.8em',
    };

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
                        sx={{
                            minHeight: '34px!important',
                            borderBottom: '1px solid #dadada',
                        }}
                        elevation={0}
                    >
                        <Tabs
                            value={revisionTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                            sx={{
                                minHeight: '34px',
                            }}
                        >
                            <Tab sx={tabStyle} label="Data Layers " />
                            <Tab sx={tabStyle} label="Revision" />
                            <Tab sx={tabStyle} label="Platform" />
                            {errors.length > 0 && <Tab sx={tabStyle} label="Errors" />}
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
