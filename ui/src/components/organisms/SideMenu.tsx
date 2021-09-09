import { FC } from 'react';
import { Box, createStyles, List } from '@material-ui/core';
import { SideMenuButton, SideMenuButtonProps } from '../molecules/SideMenuButton';
import { makeStyles } from '@material-ui/core/styles';
import { navigationColorFromSectionLocator } from '../../containers/SectionsDetails';
import { useLoggedInState } from '../../context/AppContext';

type SideMenuProps = {
    menuItemsProps: SideMenuButtonProps[];
};

const useStyles = makeStyles((theme) =>
    createStyles({
        cornerColor: {
            zIndex: theme.zIndex.appBar,
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '15px 15px 0 0',
        },
    }),
);

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { menuItemsProps } = props;
    const classes = useStyles();
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;
    const navigationColor = navigationColorFromSectionLocator(sectionHistory.current);

    return (
        <div className="sideMenu">
            <Box height={15} bgcolor={navigationColor} />
            <div
                className={classes.cornerColor}
                style={{
                    borderColor: `${navigationColor} transparent transparent transparent`,
                }}
            />
            <Box height={25} />
            <List disablePadding>
                {menuItemsProps.map((menuItemProps, key) => (
                    <SideMenuButton key={key} {...menuItemProps} />
                ))}
            </List>
            <Box height={15} />
        </div>
    );
};

export default SideMenu;
