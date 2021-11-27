import { FC } from 'react';
import NextLink from 'next/link';
import { Box, ListItem, ListItemIcon, ListItemText, SvgIconProps } from '@mui/material';
import { useRouter } from 'next/router';

export type PageMenuButtonProps = {
    link: string;
    label: string;
    icon: FC<SvgIconProps>;
    disabled?: boolean;
};

const SideMenuButton: FC<PageMenuButtonProps> = (props: PageMenuButtonProps) => {
    const router = useRouter();

    const listItemBackgroundColor = router.asPath === props.link ? '#d3d5d5' : undefined;

    return (
        <>
            <Box
                sx={{
                    zIndex: (theme) => theme.zIndex.appBar,
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '15px 15px 0 0',
                    borderColor: '#ffffff transparent transparent transparent',
                }}
            />
            <NextLink href={props.link} passHref>
                <ListItem
                    button
                    disableGutters={true}
                    sx={{
                        backgroundColor: listItemBackgroundColor,
                        '&:hover': {
                            backgroundColor: listItemBackgroundColor,
                        },
                    }}
                    disabled={!!props.disabled}
                >
                    <ListItemIcon
                        sx={{
                            marginLeft: '14px',
                            display: 'inline-flex',
                            minWidth: '36px',
                            flexShrink: 0,
                            justifyContent: 'center',
                        }}
                    >
                        <props.icon sx={{ fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText
                        sx={{
                            '& span': {
                                fontSize: '1em',
                            },
                        }}
                        primary={props.label}
                    />
                </ListItem>
            </NextLink>
            <Box
                sx={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    right: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 0 15px 15px',
                    borderColor: 'transparent transparent #ffffff transparent',
                    marginTop: '-15px',
                }}
            />
        </>
    );
};

export { SideMenuButton };
