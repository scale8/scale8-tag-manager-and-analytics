import { FC } from 'react';
import { Box, List } from '@mui/material';
import { SideMenuButton, PageMenuButtonProps } from '../molecules/SideMenuButton';

type SideMenuProps = {
    menuItemsProps: PageMenuButtonProps[];
};

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { menuItemsProps } = props;

    return (
        <div className="sideMenu">
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
