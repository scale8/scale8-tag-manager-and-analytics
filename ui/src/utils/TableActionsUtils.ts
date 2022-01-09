import {
    CoupleAction,
    FieldAction,
    FreeAction,
    RowAction,
    RowData,
} from '../components/molecules/S8Table/S8TableTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LockIcon from '@mui/icons-material/Lock';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import HistoryIcon from '@mui/icons-material/History';
import PublishIcon from '@mui/icons-material/Publish';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnLockIcon from '@mui/icons-material/VpnLock';

export const buildEditAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: EditIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
});

export const buildDeleteAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: DeleteIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildAddAction = (
    onClick: () => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): FreeAction => ({
    icon: AddIcon,
    tooltip,
    onClick,
    disabled: disabled({ id: '' }),
});

export const buildSelectAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: ArrowForwardIcon,
    tooltip,
    onClick,
    disabled,
    unLockable: true,
});

export const buildFieldAction = (
    field: keyof RowData,
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): FieldAction<RowData> => ({
    onClick,
    tooltip,
    field,
    disabled,
});

export const buildDuplicateAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: FileCopyIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildDeployAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: PublishIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
});

export const buildFinalizeAndDeployAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: PublishIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
});

export const buildInstallInstructionsAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: CodeIcon,
    tooltip,
    onClick,
    disabled,
    unLockable: true,
});

export const buildPayloadPreviewAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: VisibilityIcon,
    tooltip,
    onClick,
    disabled,
    unLockable: true,
});

export const buildFinaliseAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: LockIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildCompareAction = (
    onClick: (leftId: string, rightId: string, event: any) => void,
    tooltip: string,
): CoupleAction => ({
    icon: CompareArrowsIcon,
    tooltip,
    onClick,
});

export const buildApproveAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
): RowAction<RowData> => ({
    icon: ThumbUpIcon,
    tooltip,
    onClick,
});

export const buildPreviewAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: VisibilityIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
    unLockable: true,
});

export const buildEditVariablesAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: SettingsIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildEditCustomDomainAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: VpnLockIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildHistoryAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: HistoryIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
});

export const buildPublishAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: PublishIcon,
    tooltip,
    onClick,
    disabled,
});

export const buildPasswordAction = (
    onClick: (data: RowData) => void,
    tooltip: string,
    disabled: (data: RowData) => boolean,
    hidden?: (data: RowData) => boolean,
): RowAction<RowData> => ({
    icon: LockOpenIcon,
    tooltip,
    onClick,
    disabled,
    hidden,
});
