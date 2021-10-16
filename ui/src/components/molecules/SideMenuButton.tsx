import { FC } from 'react';
import NextLink from 'next/link';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) =>
    createStyles({
        cornerLight: {
            zIndex: theme.zIndex.appBar,
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '15px 15px 0 0',
            borderColor: '#fafafa transparent transparent transparent',
        },
        cornerLightBottom: {
            position: 'absolute',
            width: 0,
            height: 0,
            right: 0,
            borderStyle: 'solid',
            borderWidth: '0 0 15px 15px',
            borderColor: 'transparent transparent #fafafa transparent',
            marginTop: '-15px',
        },
        listItemActive: {
            backgroundColor: '#d8d8d8',
            '&:hover': {
                backgroundColor: '#d8d8d8',
            },
        },
        listIcon: {
            marginLeft: '14px',
            display: 'inline-flex',
            minWidth: '36px',
            flexShrink: 0,
            justifyContent: 'center',
        },
        listText: {
            '& span': {
                fontSize: '1em',
            },
        },
    }),
);

export type SideMenuButtonProps = {
    link: string;
    label: string;
    icon: JSX.Element;
    disabled?: boolean;
};

const SideMenuButton: FC<SideMenuButtonProps> = (props: SideMenuButtonProps) => {
    const classes = useStyles();

    const router = useRouter();

    return (
        <>
            <div className={classes.cornerLight} />
            <NextLink href={props.link} passHref>
                <ListItem
                    button
                    disableGutters={true}
                    className={router.asPath === props.link ? classes.listItemActive : ''}
                    disabled={!!props.disabled}
                >
                    <ListItemIcon className={classes.listIcon}>{props.icon}</ListItemIcon>
                    <ListItemText className={classes.listText} primary={props.label} />
                </ListItem>
            </NextLink>
            <div className={classes.cornerLightBottom} />
        </>
    );
};

export { SideMenuButton };
