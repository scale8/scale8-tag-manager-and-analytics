import { FC } from 'react';
import { SideMenuButton, PageMenuButtonProps } from '../molecules/SideMenuButton';

type SideMenuProps = {
    menuItemsProps: PageMenuButtonProps[];
};

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { menuItemsProps } = props;

    return (
        <div className="sideMenu">
            {menuItemsProps.map((menuItemProps, key) => (
                <SideMenuButton key={key} {...menuItemProps} />
            ))}
        </div>
    );
};

export default SideMenu;
