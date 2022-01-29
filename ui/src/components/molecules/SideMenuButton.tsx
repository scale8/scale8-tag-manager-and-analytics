import { FC } from 'react';
import { IconButton, SvgIconProps, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { navigationColorFromSectionLocator } from '../../containers/SectionsDetails';
import { useLoggedInState } from '../../context/AppContext';

export type PageMenuButtonProps = {
    link: string;
    label: string;
    icon: FC<SvgIconProps>;
    disabled?: boolean;
};

const SideMenuButton: FC<PageMenuButtonProps> = (props: PageMenuButtonProps) => {
    const router = useRouter();

    const { templateInteractions } = useLoggedInState();
    const { section } = templateInteractions;
    const navigationColor = navigationColorFromSectionLocator(section);

    return (
        <Tooltip title={props.label} placement="right">
            <IconButton
                sx={{
                    color: router.asPath === props.link ? navigationColor : 'white',
                }}
                color="inherit"
                onClick={() => {
                    router.push(props.link).then();
                }}
                size="large"
            >
                <props.icon />
            </IconButton>
        </Tooltip>
    );
};

export { SideMenuButton };
