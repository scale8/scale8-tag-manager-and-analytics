import { FC } from 'react';
import { SelectValueWithSub } from '../hooks/form/useFormValidation';
import { SvgIconProps } from '@material-ui/core';
import { TypeIcon } from '../gql/generated/globalTypes';
import DefaultActionIcon from '../components/atoms/Icons/TypeIcons/DefaultActionIcon';
import ObjectIcon from '../components/atoms/Icons/TypeIcons/ObjectIcon';
import ObjectsIcon from '../components/atoms/Icons/TypeIcons/ObjectsIcon';
import RadioIcon from '../components/atoms/Icons/TypeIcons/RadioIcon';
import CheckboxTypeIcon from '../components/atoms/Icons/TypeIcons/CheckboxTypeIcon';
import ColorIcon from '../components/atoms/Icons/TypeIcons/ColorIcon';
import CodeTypeIcon from '../components/atoms/Icons/TypeIcons/CodeTypeIcon';
import DateIcon from '../components/atoms/Icons/TypeIcons/DateIcon';
import SelectorIcon from '../components/atoms/Icons/TypeIcons/SelectorIcon';
import TextIcon from '../components/atoms/Icons/TypeIcons/TextIcon';
import GeoIcon from '../components/atoms/Icons/TypeIcons/GeoIcon';
import NumberIcon from '../components/atoms/Icons/TypeIcons/NumberIcon';
import ListIcon from '../components/atoms/Icons/TypeIcons/ListIcon';
import DefaultEventIcon from '../components/atoms/Icons/TypeIcons/DefaultEventIcon';
import DefaultDataContainerIcon from '../components/atoms/Icons/TypeIcons/DefaultDataContainerIcon';
import DefaultDataMapIcon from '../components/atoms/Icons/TypeIcons/DefaultDataMapIcon';
import VisualActionIcon from '../components/atoms/Icons/TypeIcons/VisualActionIcon';
import LogActionIcon from '../components/atoms/Icons/TypeIcons/LogActionIcon';
import DataActionIcon from '../components/atoms/Icons/TypeIcons/DataActionIcon';
import CodeEventIcon from '../components/atoms/Icons/TypeIcons/CodeEventIcon';
import BrowserEventIcon from '../components/atoms/Icons/TypeIcons/BrowserEventIcon';
import TagEventIcon from '../components/atoms/Icons/TypeIcons/TagEventIcon';
import PageEventIcon from '../components/atoms/Icons/TypeIcons/PageEventIcon';
import BrowserDataContainerIcon from '../components/atoms/Icons/TypeIcons/BrowserDataContainerIcon';
import EnvironmentDataContainerIcon from '../components/atoms/Icons/TypeIcons/EnvironmentDataContainerIcon';
import PlatformDataContainerIcon from '../components/atoms/Icons/TypeIcons/PlatformDataContainerIcon';
import UserActionIcon from '../components/atoms/Icons/TypeIcons/UserActionIcon';
import SyncActionIcon from '../components/atoms/Icons/TypeIcons/SyncActionIcon';
import PullActionIcon from '../components/atoms/Icons/TypeIcons/PullActionIcon';
import PushActionIcon from '../components/atoms/Icons/TypeIcons/PushActionIcon';
import ResetActionIcon from '../components/atoms/Icons/TypeIcons/ResetActionIcon';
import DeleteActionIcon from '../components/atoms/Icons/TypeIcons/DeleteActionIcon';
import AddActionIcon from '../components/atoms/Icons/TypeIcons/AddActionIcon';
import UpdateActionIcon from '../components/atoms/Icons/TypeIcons/UpdateActionIcon';
import CodeActionIcon from '../components/atoms/Icons/TypeIcons/CodeActionIcon';

export type IconEntity = 'Action' | 'Data Map' | 'Data Container' | 'Event';

export type TypeIconDetails = {
    type: TypeIcon;
    label: string;
    icon: FC<SvgIconProps>;
    entity: IconEntity;
};

const TypeIconsMap: TypeIconDetails[] = [
    {
        type: TypeIcon.DEFAULT_DATA_MAP,
        label: 'Default Data Map',
        icon: DefaultDataMapIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.OBJECT,
        label: 'Object',
        icon: ObjectIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.OBJECTS,
        label: 'Objects',
        icon: ObjectsIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.RADIO,
        label: 'Radio',
        icon: RadioIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.CHECKBOX,
        label: 'Checkbox',
        icon: CheckboxTypeIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.COLOR,
        label: 'Color',
        icon: ColorIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.CODE,
        label: 'Code',
        icon: CodeTypeIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.DATE,
        label: 'Date',
        icon: DateIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.SELECTOR,
        label: 'Selector',
        icon: SelectorIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.GEO,
        label: 'Geo',
        icon: GeoIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.TEXT,
        label: 'Text',
        icon: TextIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.NUMBER,
        label: 'Number',
        icon: NumberIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.LIST,
        label: 'List',
        icon: ListIcon,
        entity: 'Data Map',
    },
    {
        type: TypeIcon.DEFAULT_ACTION,
        label: 'Default Action',
        icon: DefaultActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.VISUAL_ACTION,
        label: 'Visual Action',
        icon: VisualActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.LOG_ACTION,
        label: 'Log Action',
        icon: LogActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.USER_ACTION,
        label: 'User Action',
        icon: UserActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.DATA_ACTION,
        label: 'Data Action',
        icon: DataActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.ADD_ACTION,
        label: 'Add Action',
        icon: AddActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.UPDATE_ACTION,
        label: 'Update Action',
        icon: UpdateActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.DELETE_ACTION,
        label: 'Delete Action',
        icon: DeleteActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.CODE_ACTION,
        label: 'Code Action',
        icon: CodeActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.RESET_ACTION,
        label: 'Reset Action',
        icon: ResetActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.PUSH_ACTION,
        label: 'Push Action',
        icon: PushActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.PULL_ACTION,
        label: 'Pull Action',
        icon: PullActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.SYNC_ACTION,
        label: 'Sync Action',
        icon: SyncActionIcon,
        entity: 'Action',
    },
    {
        type: TypeIcon.DEFAULT_EVENT,
        label: 'Default Event',
        icon: DefaultEventIcon,
        entity: 'Event',
    },
    {
        type: TypeIcon.CODE_EVENT,
        label: 'Code Event',
        icon: CodeEventIcon,
        entity: 'Event',
    },
    {
        type: TypeIcon.BROWSER_EVENT,
        label: 'Browser Event',
        icon: BrowserEventIcon,
        entity: 'Event',
    },
    {
        type: TypeIcon.PAGE_EVENT,
        label: 'Page Event',
        icon: PageEventIcon,
        entity: 'Event',
    },
    {
        type: TypeIcon.TAG_EVENT,
        label: 'Tag Event',
        icon: TagEventIcon,
        entity: 'Event',
    },
    {
        type: TypeIcon.DEFAULT_DATA_CONTAINER,
        label: 'Default Data Container',
        icon: DefaultDataContainerIcon,
        entity: 'Data Container',
    },
    {
        type: TypeIcon.BROWSER_DATA_CONTAINER,
        label: 'Browser Data Container',
        icon: BrowserDataContainerIcon,
        entity: 'Data Container',
    },
    {
        type: TypeIcon.ENVIRONMENT_DATA_CONTAINER,
        label: 'Environment Data Container',
        icon: EnvironmentDataContainerIcon,
        entity: 'Data Container',
    },
    {
        type: TypeIcon.PLATFORM_DATA_CONTAINER,
        label: 'Platform Data Container',
        icon: PlatformDataContainerIcon,
        entity: 'Data Container',
    },
];

const getTypeIconDetails = (type: string): TypeIconDetails => {
    const platformDataMapType = TypeIconsMap.find((_) => type === _.type);
    if (platformDataMapType === undefined) {
        throw Error('Invalid PlatformDataMap Type');
    }
    return platformDataMapType;
};

const getActionIcon = (type?: TypeIcon | null): FC<SvgIconProps> => {
    if (type === null || type == undefined) return DefaultActionIcon;
    return getTypeIconDetails(type).icon;
};

const getEventIcon = (type?: TypeIcon | null): FC<SvgIconProps> => {
    if (type === null || type == undefined) return DefaultEventIcon;
    return getTypeIconDetails(type).icon;
};

const getDataContainersIcon = (type?: TypeIcon | null): FC<SvgIconProps> => {
    if (type === null || type == undefined) return DefaultDataContainerIcon;
    return getTypeIconDetails(type).icon;
};

const getDataMapsIcon = (type?: TypeIcon | null): FC<SvgIconProps> => {
    if (type === null || type == undefined) return DefaultDataMapIcon;
    return getTypeIconDetails(type).icon;
};

const getSelectValuesForTypeIcons = (entity: IconEntity): SelectValueWithSub[] => {
    return TypeIconsMap.filter((_) => _.entity === entity).map((_) => ({
        key: _.type,
        text: _.label,
        icon: <_.icon />,
    }));
};

export {
    getActionIcon,
    getEventIcon,
    getDataContainersIcon,
    getDataMapsIcon,
    getSelectValuesForTypeIcons,
};
