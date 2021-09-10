import {
    CoupleAction,
    FieldAction,
    FreeAction,
    RowAction,
    RowData,
} from '../components/molecules/S8Table/S8TableTypes';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LockIcon from '@material-ui/icons/Lock';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SettingsIcon from '@material-ui/icons/Settings';
import CodeIcon from '@material-ui/icons/Code';
import HistoryIcon from '@material-ui/icons/History';
import PublishIcon from '@material-ui/icons/Publish';
import LockOpenIcon from '@material-ui/icons/LockOpen';

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
