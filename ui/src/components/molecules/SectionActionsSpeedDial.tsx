import { FC, useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

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
                    sx={{
                        '&  .MuiFab-root': {
                            color: (theme) => theme.palette.common.black,
                        },
                        '& > .MuiFab-root': {
                            backgroundColor: 'transparent !important',
                            boxShadow: 'none',
                        },
                    }}
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
