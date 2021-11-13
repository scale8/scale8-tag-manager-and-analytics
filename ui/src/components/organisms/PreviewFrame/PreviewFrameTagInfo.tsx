import { ChangeEvent, FC, useContext, useEffect, useRef } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import { PreviewFrameTagRules } from './PreviewFrameTagRules';
import { findTagIndex, matchTagCode } from '../../../utils/PreviewUtils';
import { TagType } from '../../../gql/generated/globalTypes';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

const PreviewFrameTagInfo: FC = () => {
    const {
        revisionStatus,
        previewFrameData,
        setCurrentTagCode,
        currentTagCode,
        gotoElement,
        setGotoElement,
    } = useContext(previewFrameContext);

    const tagContentRef = useRef<HTMLInputElement>(null);

    const scrollToTop = () => {
        if (tagContentRef !== null && tagContentRef.current !== null) {
            tagContentRef.current.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        // if the highlight action does not belong
        // to the current tag reset and scroll to top
        if (gotoElement === undefined || !matchTagCode(gotoElement.tagCode, currentTagCode)) {
            scrollToTop();
            setGotoElement(undefined);
        }
    }, [gotoElement, currentTagCode, setGotoElement]);

    const loadedTags = revisionStatus?.tags.filter((_) => _.tagCode.code === currentTagCode?.code);

    const handleChange = (event: ChangeEvent<any>, newValue: number) => {
        if (currentTagCode !== undefined) {
            setCurrentTagCode({
                code: currentTagCode.code,
                index: loadedTags === undefined ? 0 : loadedTags[newValue].tagCode.index,
            });
        }
    };

    const tagData = previewFrameData?.getRevision.tags.find(
        (_) => _.tag_code === currentTagCode?.code,
    );

    return (
        <Box width="100%" height="100%" bgcolor="#ffffff">
            {revisionStatus === undefined ||
            previewFrameData === undefined ||
            tagData === undefined ||
            loadedTags === undefined ? (
                <Box
                    height="50px"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress color="inherit" size={20} />
                </Box>
            ) : loadedTags.length === 0 ? (
                <Box m={1}>
                    <Alert severity="error">
                        This tag cannot be found on the page, if it is required please verify that
                        the relative code has been properly added to the page.
                    </Alert>
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
                            value={findTagIndex(loadedTags, currentTagCode?.index)}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                            sx={{
                                minHeight: '34px',
                            }}
                        >
                            {loadedTags.map((_) => (
                                <Tab
                                    sx={{
                                        minHeight: '34px',
                                        fontSize: '0.8em',
                                    }}
                                    key={_.tagCode.index}
                                    label={`Tag #${_.tagCode.index}`}
                                />
                            ))}
                        </Tabs>
                    </AppBar>
                    <Box
                        p={1}
                        overflow="auto"
                        flexGrow={0}
                        height="100%"
                        {...{ ref: tagContentRef }}
                    >
                        <Box mb={2}>
                            <Typography variant="h6" component="div">
                                {tagData.name} (Tag #
                                {
                                    loadedTags[findTagIndex(loadedTags, currentTagCode?.index)]
                                        .tagCode.index
                                }
                                )
                            </Typography>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Box fontSize="16px">
                                        Type: {tagData.type.charAt(0).toUpperCase()}
                                        {tagData.type.slice(1).toLowerCase()}{' '}
                                        {tagData.type === TagType.PLACEMENT && (
                                            <span>
                                                ({tagData.width} x {tagData.height})
                                            </span>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box fontSize="14px" color="#888888">
                                        Code: {tagData.tag_code}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        {currentTagCode !== undefined && (
                            <PreviewFrameTagRules
                                tagData={tagData}
                                tagStatus={
                                    loadedTags[findTagIndex(loadedTags, currentTagCode.index)]
                                }
                            />
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export { PreviewFrameTagInfo };
