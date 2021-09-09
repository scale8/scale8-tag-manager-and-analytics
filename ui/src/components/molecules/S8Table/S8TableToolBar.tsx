import { Dispatch, MouseEvent, ReactElement, SetStateAction, useState } from 'react';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Input,
    InputAdornment,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { BulkAction, Column, CoupleAction, FreeAction, RowData } from './S8TableTypes';
import { InfoButton, InfoProps } from '../InfoButton';

interface S8TableToolbarProps<T extends RowData> {
    selected: string[];
    title: string;
    mainInfoProps?: InfoProps;
    freeActions?: FreeAction[];
    bulkActions?: BulkAction[];
    coupleActions?: CoupleAction[];
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
    columns: Column<T>[];
    setColumns: Dispatch<SetStateAction<Column<T>[]>>;
    actionsLocked?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        highlight: {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.9),
        },
        title: {
            flex: '1 1 100%',
        },
        freeAction: {
            color: 'white',
            backgroundColor: theme.palette.primary.main,
            width: '40px',
            height: '40px',
            marginLeft: theme.spacing(4),
            boxShadow:
                '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
                boxShadow:
                    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
            },
        },
        search: {
            width: '300px',
            marginLeft: theme.spacing(2),
        },
    }),
);

const S8TableToolbar = <T extends RowData>(props: S8TableToolbarProps<T>): ReactElement => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        selected,
        title,
        mainInfoProps,
        freeActions,
        bulkActions,
        coupleActions,
        filter,
        setFilter,
        actionsLocked,
    } = props;
    const numSelected = selected.length;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography
                    className={classes.title}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    <Box component="span" mr="3px">
                        {title}
                    </Box>
                    {mainInfoProps !== undefined && <InfoButton {...mainInfoProps} />}
                </Typography>
            )}

            <>
                <Tooltip title="Select columns">
                    <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                        <IconButton
                            onClick={handleClick}
                            color="inherit"
                            aria-label="Select columns"
                        >
                            <ViewColumnIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Menu
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {props.columns.map((column: Column<T>, index: number) => (
                        <MenuItem key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!column.hidden}
                                        onChange={(event) => {
                                            props.setColumns(
                                                props.columns.map((_) => {
                                                    if (_.field === event.target.value) {
                                                        return {
                                                            ..._,
                                                            hidden: !_.hidden,
                                                        };
                                                    } else return _;
                                                }),
                                            );
                                        }}
                                        value={column.field}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label={column.title}
                            />
                        </MenuItem>
                    ))}
                </Menu>
                <Input
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={classes.search}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search' }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setFilter('')}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
                {freeActions &&
                    freeActions.map((action, i) => (
                        <Tooltip key={i} title={action.tooltip}>
                            <span>
                                <IconButton
                                    className={classes.freeAction}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                    disabled={
                                        action.disabled || (actionsLocked && !action.unLockable)
                                    }
                                >
                                    <action.icon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ))}
                {coupleActions &&
                    coupleActions.map((action, i) => (
                        <Tooltip key={i} title={action.tooltip}>
                            <span>
                                <IconButton
                                    className={classes.freeAction}
                                    disabled={
                                        numSelected !== 2 || (actionsLocked && !action.unLockable)
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(selected[0], selected[1], e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                >
                                    <action.icon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ))}
                {numSelected > 0 &&
                    bulkActions &&
                    bulkActions.map((action, i) => (
                        <Tooltip key={i} title={action.tooltip}>
                            <span>
                                <IconButton
                                    className={classes.freeAction}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(selected, e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                    disabled={actionsLocked && !action.unLockable}
                                >
                                    <action.icon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ))}
            </>
        </Toolbar>
    );
};
export default S8TableToolbar;
