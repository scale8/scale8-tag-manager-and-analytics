import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    speedDial: {
        '&  .MuiFab-root': {
            color: theme.palette.common.black,
        },
        '& > .MuiFab-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
        },
    },
}));

export type SectionAction = {
    icon: JSX.Element;
    onClick: (id: string, event: any) => void;
    name: string;
    disabled?: boolean;
};

type SectionActionsSpeedDialProps = {
    id: string;
    actions: SectionAction[];
    hide?: boolean;
};

const SectionActionsSpeedDial: FC<SectionActionsSpeedDialProps> = (
    props: SectionActionsSpeedDialProps,
) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {!props.hide && (
                <SpeedDial
                    ariaLabel="Section actions"
                    className={classes.speedDial}
                    icon={<SpeedDialIcon icon={<MoreVertIcon />} openIcon={<CloseIcon />} />}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                    direction="left"
                    FabProps={{
                        size: 'small',
                    }}
                >
                    {props.actions.map((action) => (
                        <SpeedDialAction
                            title={action.name}
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={(event) => {
                                action.onClick(props.id, event);
                            }}
                            FabProps={{
                                disabled: !!action.disabled,
                            }}
                        />
                    ))}
                </SpeedDial>
            )}
        </>
    );
};

export { SectionActionsSpeedDial };
