import { FC, useState, ChangeEvent } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { ActionGroupDistributionCreate } from './ActionGroupDistributionCreate';
import { ActionGroupDistributionLink } from './ActionGroupDistributionLink';
import { InfoButton } from '../../../../components/molecules/InfoButton';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabsTabPanel from '../../../../components/molecules/TabsTabPanel';
import { Divider } from '@material-ui/core';
import { MainDrawerTitle } from '../../../../components/molecules/MainDrawerTitle';

const ActionGroupDistributionAdd: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <MainDrawerTitle handleDialogClose={props.handleDialogClose}>
                Add Action Group Distribution
                <InfoButton {...buildStandardFormInfo('actionGroupDistributions', 'Add')} />
            </MainDrawerTitle>
            <AppBar position="static" color="default" elevation={0}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Create Custom" wrapped />
                    <Tab label="Link Global" wrapped />
                </Tabs>
            </AppBar>
            <Divider />
            <TabsTabPanel value={value} index={0}>
                <ActionGroupDistributionCreate
                    {...props}
                    noTitle
                    submitText="Create Custom Action Group Distribution"
                />
            </TabsTabPanel>
            <TabsTabPanel value={value} index={1}>
                <ActionGroupDistributionLink {...props} />
            </TabsTabPanel>
        </>
    );
};

export { ActionGroupDistributionAdd };
