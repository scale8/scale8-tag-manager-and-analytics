import { Dispatch, MouseEvent, ReactElement, SetStateAction, useState } from 'react';
import { lighten, Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Input,
    InputAdornment,
    Menu,
    MenuItem,
} from '@mui/material';
import { BulkAction, Column, CoupleAction, FreeAction, RowData } from './S8TableTypes';
import { InfoButton, InfoProps } from '../InfoButton';
import { SxProps } from '@mui/system';

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

const S8TableToolbar = <T extends RowData>(props: S8TableToolbarProps<T>): ReactElement => {
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

    const freeActionStyle: SxProps<Theme> = {
        color: 'white',
        backgroundColor: (theme) => theme.palette.primary.main,
        width: '40px',
        height: '40px',
        marginLeft: 4,
        boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.main,
            boxShadow:
                '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
        },
    };

    return (
        <Toolbar
            sx={{
                padding: (theme) => theme.spacing(0, 2),
                color: (theme) => (numSelected > 0 ? theme.palette.secondary.main : undefined),
                backgroundColor: (theme) =>
                    numSelected > 0 ? lighten(theme.palette.secondary.light, 0.9) : undefined,
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    <Box component="span" mr="3px">
                        {title}
                    </Box>
                    {mainInfoProps !== undefined && <InfoButton {...mainInfoProps} />}
                </Typography>
            )}

            <>
                <Tooltip title="Select columns">
                    <Box component="span" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                        <IconButton
                            onClick={handleClick}
                            color="inherit"
                            aria-label="Select columns"
                            size="large"
                        >
                            <ViewColumnIcon />
                        </IconButton>
                    </Box>
                </Tooltip>
                <Menu
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
                    sx={{ width: '300px', marginLeft: 2 }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search' }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setFilter('')}
                                size="large"
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
                                    sx={freeActionStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                    disabled={
                                        action.disabled || (actionsLocked && !action.unLockable)
                                    }
                                    size="large"
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
                                    sx={freeActionStyle}
                                    disabled={
                                        numSelected !== 2 || (actionsLocked && !action.unLockable)
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(selected[0], selected[1], e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                    size="large"
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
                                    sx={freeActionStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(selected, e);
                                    }}
                                    color="inherit"
                                    aria-label={action.tooltip}
                                    disabled={actionsLocked && !action.unLockable}
                                    size="large"
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
