import { FC } from 'react';
import { SelectValueWithSub } from '../hooks/form/useFormValidation';
import { SvgIconProps } from '@mui/material';
import { InputType, VarType } from '../gql/generated/globalTypes';
import BooleanIcon from '../components/atoms/Icons/DataMapTypes/BooleanIcon';
import CssIcon from '../components/atoms/Icons/DataMapTypes/CssIcon';
import ColorDmIcon from '../components/atoms/Icons/DataMapTypes/ColorDmIcon';
import CountryIcon from '../components/atoms/Icons/DataMapTypes/CountryIcon';
import DomSelectorIcon from '../components/atoms/Icons/DataMapTypes/DomSelectorIcon';
import DateStampIcon from '../components/atoms/Icons/DataMapTypes/DateStampIcon';
import DateStringIcon from '../components/atoms/Icons/DataMapTypes/DateStringIcon';
import DateTimeStampIcon from '../components/atoms/Icons/DataMapTypes/DateTimeStampIcon';
import DateTimeStringIcon from '../components/atoms/Icons/DataMapTypes/DateTimeStringIcon';
import EmailIcon from '../components/atoms/Icons/DataMapTypes/EmailIcon';
import FloatIcon from '../components/atoms/Icons/DataMapTypes/FloatIcon';
import FloatArrayIcon from '../components/atoms/Icons/DataMapTypes/FloatArrayIcon';
import HtmlIcon from '../components/atoms/Icons/DataMapTypes/HtmlIcon';
import IntIcon from '../components/atoms/Icons/DataMapTypes/IntIcon';
import IntArrayIcon from '../components/atoms/Icons/DataMapTypes/IntArrayIcon';
import JsIcon from '../components/atoms/Icons/DataMapTypes/JsIcon';
import JsonIcon from '../components/atoms/Icons/DataMapTypes/JsonIcon';
import ObjectArrayIcon from '../components/atoms/Icons/DataMapTypes/ObjectArrayIcon';
import ObjectDmIcon from '../components/atoms/Icons/DataMapTypes/ObjectDmIcon';
import RadioDmIcon from '../components/atoms/Icons/DataMapTypes/RadioDmIcon';
import SelectIcon from '../components/atoms/Icons/DataMapTypes/SelectIcon';
import TextAreaIcon from '../components/atoms/Icons/DataMapTypes/TextAreaIcon';
import TextDmIcon from '../components/atoms/Icons/DataMapTypes/TextDmIcon';
import UrlIcon from '../components/atoms/Icons/DataMapTypes/UrlIcon';
import TextAreaArrayIcon from '../components/atoms/Icons/DataMapTypes/TextAreaArrayIcon';
import TextArrayIcon from '../components/atoms/Icons/DataMapTypes/TextArrayIcon';
import CheckboxDmIcon from '../components/atoms/Icons/DataMapTypes/CheckboxDmIcon';
import UrlMacroIcon from '../components/atoms/Icons/DataMapTypes/UrlMacroIcon';

export type PlatformDataMapType = {
    type: string;
    inputType: InputType;
    varType: VarType;
    iconType: string;
    icon: FC<SvgIconProps>;
    buildSample: (
        indexArray: number[],
        options: S8DataMapValue[],
    ) => {
        value?: any;
        values?: any[];
    };
};

const PlatformDataMapTypeMap: PlatformDataMapType[] = [
    {
        type: 'Boolean',
        inputType: InputType.BOOLEAN_INPUT,
        varType: VarType.BOOLEAN,
        iconType: 'RadioIcon',
        icon: BooleanIcon,
        buildSample: () => ({
            value: true,
        }),
    },
    {
        type: 'CSS',
        inputType: InputType.CSS,
        varType: VarType.STRING,
        iconType: 'CodeTypeIcon',
        icon: CssIcon,
        buildSample: () => ({
            value: `body {\n    color: black;\n    background-color: white;\n}`,
        }),
    },
    {
        type: 'Checkbox',
        inputType: InputType.CHECKBOX,
        varType: VarType.BOOLEAN,
        iconType: 'CheckboxTypeIcon',
        icon: CheckboxDmIcon,
        buildSample: () => ({
            value: true,
        }),
    },
    {
        type: 'Color',
        inputType: InputType.COLOR,
        varType: VarType.STRING,
        iconType: 'ColorIcon',
        icon: ColorDmIcon,
        buildSample: () => ({
            value: '#984141',
        }),
    },
    {
        type: 'Country',
        inputType: InputType.COUNTRY_CODE_SELECT,
        varType: VarType.STRING,
        iconType: 'GeoIcon',
        icon: CountryIcon,
        buildSample: () => ({
            value: 'GB',
        }),
    },
    {
        type: 'Consent Purposes',
        inputType: InputType.CONSENT_PURPOSES,
        varType: VarType.ARRAY_INT,
        iconType: 'ListIcon',
        icon: SelectIcon,
        buildSample: () => ({
            values: [1, 2],
        }),
    },
    {
        type: 'Consent Vendors',
        inputType: InputType.CONSENT_VENDORS,
        varType: VarType.ARRAY_INT,
        iconType: 'ListIcon',
        icon: SelectIcon,
        buildSample: () => ({
            values: [1, 2],
        }),
    },
    {
        type: 'DOM Selector',
        inputType: InputType.DOM_SELECTOR_INPUT,
        varType: VarType.STRING,
        iconType: 'SelectorIcon',
        icon: DomSelectorIcon,
        buildSample: () => ({
            value: '.classname #elementid ',
        }),
    },
    {
        type: 'Date Stamp',
        inputType: InputType.DATE_STAMP,
        varType: VarType.TIMESTAMP,
        iconType: 'DateIcon',
        icon: DateStampIcon,
        buildSample: () => ({
            value: 1614887460000,
        }),
    },
    {
        type: 'Date String',
        inputType: InputType.DATE_STRING,
        varType: VarType.DATETIME,
        iconType: 'DateIcon',
        icon: DateStringIcon,
        buildSample: () => ({
            value: '2021-03-10 12:00:00.000',
        }),
    },
    {
        type: 'DateTime Stamp',
        inputType: InputType.DATETIME_STAMP,
        varType: VarType.TIMESTAMP,
        iconType: 'DateIcon',
        icon: DateTimeStampIcon,
        buildSample: () => ({
            value: 1615377600000,
        }),
    },
    {
        type: 'DateTime String',
        inputType: InputType.DATETIME_STRING,
        varType: VarType.DATETIME,
        iconType: 'DateIcon',
        icon: DateTimeStringIcon,
        buildSample: () => ({
            value: '2021-03-10 12:00:00.000',
        }),
    },
    {
        type: 'Email',
        inputType: InputType.EMAIL,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: EmailIcon,
        buildSample: (indexArray: number[]) => ({
            value: `sample-${indexArray.join('-')}@sample.com`,
        }),
    },
    {
        type: 'Float',
        inputType: InputType.FLOAT_INPUT,
        varType: VarType.FLOAT,
        iconType: 'NumberIcon',
        icon: FloatIcon,
        buildSample: () => ({
            value: 12.3,
        }),
    },
    {
        type: 'Float Array',
        inputType: InputType.FLOAT_ARRAY_INPUT,
        varType: VarType.ARRAY_FLOAT,
        iconType: 'NumberIcon',
        icon: FloatArrayIcon,
        buildSample: () => ({
            values: [12.3, 23.4, 34.56],
        }),
    },
    {
        type: 'HTML',
        inputType: InputType.HTML,
        varType: VarType.STRING,
        iconType: 'CodeTypeIcon',
        icon: HtmlIcon,
        buildSample: () => ({
            value: `<html lang="en">\n    <body>\n        <h1>Title</h1>\n    </body>\n</html>`,
        }),
    },
    {
        type: 'Int',
        inputType: InputType.INT_INPUT,
        varType: VarType.INT,
        iconType: 'NumberIcon',
        icon: IntIcon,
        buildSample: () => ({
            value: 123,
        }),
    },
    {
        type: 'Int Array',
        inputType: InputType.INT_ARRAY_INPUT,
        varType: VarType.ARRAY_INT,
        iconType: 'NumberIcon',
        icon: IntArrayIcon,
        buildSample: () => ({
            values: [12, 23, 34],
        }),
    },
    {
        type: 'JSON',
        inputType: InputType.JSON,
        varType: VarType.STRING,
        iconType: 'CodeTypeIcon',
        icon: JsonIcon,
        buildSample: () => ({
            value: '{"name":"John", "age":31, "city":"New York"}',
        }),
    },
    {
        type: 'JavaScript',
        inputType: InputType.JAVASCRIPT,
        varType: VarType.STRING,
        iconType: 'CodeTypeIcon',
        icon: JsIcon,
        buildSample: () => ({
            value: `console.log("Hello world!");`,
        }),
    },
    {
        type: 'Object',
        inputType: InputType.OBJECT_INPUT,
        varType: VarType.OBJECT,
        iconType: 'ObjectIcon',
        icon: ObjectDmIcon,
        buildSample: () => ({}),
    },
    {
        type: 'Object Array',
        inputType: InputType.OBJECT_ARRAY_INPUT,
        varType: VarType.ARRAY_OBJECT,
        iconType: 'ObjectsIcon',
        icon: ObjectArrayIcon,
        buildSample: () => ({}),
    },
    {
        type: 'Radio',
        inputType: InputType.RADIO,
        varType: VarType.STRING,
        iconType: 'RadioIcon',
        icon: RadioDmIcon,
        buildSample: (indexArray: number[], options: S8DataMapValue[]) => ({
            value: options[0],
        }),
    },
    {
        type: 'Select',
        inputType: InputType.SELECT,
        varType: VarType.STRING,
        iconType: 'ListIcon',
        icon: SelectIcon,
        buildSample: (indexArray: number[], options: S8DataMapValue[]) => ({
            value: options[0],
        }),
    },
    {
        type: 'Multiple Select',
        inputType: InputType.MULTIPLE_SELECT,
        varType: VarType.STRING,
        iconType: 'ListIcon',
        icon: SelectIcon,
        buildSample: (indexArray: number[], options: S8DataMapValue[]) => ({
            value: [options[0]],
        }),
    },
    {
        type: 'Text',
        inputType: InputType.TEXT,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: TextDmIcon,
        buildSample: (indexArray: number[]) => ({
            value: `Sample Text ${indexArray.join('-')}`,
        }),
    },
    {
        type: 'Text with Macro',
        inputType: InputType.TEXT_WITH_MACRO_SUPPORT,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: TextDmIcon,
        buildSample: (indexArray: number[]) => ({
            value: `Sample Text ${indexArray.join('-')}`,
        }),
    },
    {
        type: 'Text Area',
        inputType: InputType.TEXTAREA,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: TextAreaIcon,
        buildSample: (indexArray: number[]) => ({
            value: `Sample Text...\n...multiline ${indexArray.join('-')}`,
        }),
    },
    {
        type: 'Text Array',
        inputType: InputType.TEXT_ARRAY_INPUT,
        varType: VarType.ARRAY_STRING,
        iconType: 'TextIcon',
        icon: TextArrayIcon,
        buildSample: (indexArray: number[]) => ({
            values: [
                `First Sample Text ${indexArray.join('-')}`,
                `Second Sample Text ${indexArray.join('-')}`,
            ],
        }),
    },
    {
        type: 'Textarea Array',
        inputType: InputType.TEXTAREA_ARRAY_INPUT,
        varType: VarType.ARRAY_STRING,
        iconType: 'TextIcon',
        icon: TextAreaArrayIcon,
        buildSample: (indexArray: number[]) => ({
            values: [
                `First Sample Text...\n...multiline ${indexArray.join('-')}`,
                `Second Sample Text...\n...multiline ${indexArray.join('-')}`,
            ],
        }),
    },
    {
        type: 'Url',
        inputType: InputType.URL,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: UrlIcon,
        buildSample: (indexArray: number[]) => ({
            value: `http://sample.com?v=${indexArray.join('-')}`,
        }),
    },
    {
        type: 'Url with Macro',
        inputType: InputType.URL_WITH_MACRO_SUPPORT,
        varType: VarType.STRING,
        iconType: 'TextIcon',
        icon: UrlMacroIcon,
        buildSample: () => ({
            value: `http://sample.com?v={{some.platform.macro}}`,
        }),
    },
];

const getPlatformDataMapType = (type: string): PlatformDataMapType => {
    const platformDataMapType = PlatformDataMapTypeMap.find((_) => type === _.type);
    if (platformDataMapType === undefined) {
        throw Error('Invalid PlatformDataMap Type');
    }
    return platformDataMapType;
};

const getTypeFromVarAndInput = (varType: VarType, inputType: InputType): string => {
    const platformDataMapType = PlatformDataMapTypeMap.find(
        (_) => varType === _.varType && inputType === _.inputType,
    );
    if (platformDataMapType === undefined) {
        throw Error('Invalid PlatformDataMap Type');
    }
    return platformDataMapType.type;
};

const getPlatformDataMapInputType = (type: string): InputType => {
    return getPlatformDataMapType(type).inputType;
};

const getPlatformDataMapVarType = (type: string): VarType => {
    return getPlatformDataMapType(type).varType;
};

const getPlatformDataMapIcon = (type: string): FC<SvgIconProps> => {
    return getPlatformDataMapType(type).icon;
};

const getSelectValuesForPlatformDataMapType = (): SelectValueWithSub[] => {
    return PlatformDataMapTypeMap.map((_) => ({
        key: _.type,
        text: _.type,
        iconType: _.iconType,
        icon: <_.icon />,
    }));
};

const getPlatformDataMapBuildSample = (
    type: string,
): ((
    indexArray: number[],
    options: S8DataMapValue[],
) => {
    value?: any;
    values?: any[];
}) => {
    return getPlatformDataMapType(type).buildSample;
};

export {
    PlatformDataMapTypeMap,
    getPlatformDataMapInputType,
    getPlatformDataMapVarType,
    getSelectValuesForPlatformDataMapType,
    getPlatformDataMapIcon,
    getPlatformDataMapBuildSample,
    getTypeFromVarAndInput,
};
