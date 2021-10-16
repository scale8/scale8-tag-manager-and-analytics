import { FC, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextInput, { TextInputProps } from './TextInput';
import SelectInput from './SelectInput';
import { InputAdornment } from '@mui/material';
import { InputProps as StandardInputProps } from '@mui/material/Input/Input';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    selector: {
        width: '100%',
        padding: theme.spacing(1, 0, 1),
    },
    label: {
        fontSize: '0.9em',
        padding: theme.spacing(1, 0, 1),
    },
}));

type DomSelectorProps = TextInputProps & {
    initialSelector?: 'ID' | 'Class Name' | 'Custom';
};

const DomSelectorInput: FC<DomSelectorProps> = (props: DomSelectorProps) => {
    const classes = useStyles();

    const { label, required, value, setValue, initialSelector, disabled, ...textInputProps } =
        props;

    const [selectorType, setSelectorType] = useState<'ID' | 'Class Name' | 'Custom'>(
        initialSelector === undefined ? 'Custom' : initialSelector,
    );

    const buildInputProps = (): Partial<StandardInputProps> => {
        if (selectorType === 'ID') {
            return {
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
            };
        }
        if (selectorType === 'Class Name') {
            return {
                startAdornment: <InputAdornment position="start">.</InputAdornment>,
            };
        }
        return {};
    };

    const setValueWithPrefix = (v: string): void => {
        if (v === '') {
            setValue(v);
            return;
        }
        if (selectorType === 'ID') {
            setValue('#' + v);
            return;
        }
        if (selectorType === 'Class Name') {
            setValue('.' + v);
            return;
        }
        setValue(v);
    };

    return (
        <div className={classes.root}>
            <label className={classes.label}>
                {label}
                {required && ' *'}
            </label>
            <SelectInput
                required
                label=""
                name="selectorType"
                value={selectorType}
                setValue={(v) => {
                    setSelectorType(v as 'ID' | 'Class Name' | 'Custom');
                    setValue('');
                }}
                optionValues={['ID', 'Class Name', 'Custom']}
                className={classes.selector}
                disabled={disabled}
            />
            <TextInput
                value={
                    selectorType === 'ID' || selectorType === 'Class Name'
                        ? value.substring(1)
                        : value
                }
                setValue={setValueWithPrefix}
                label=""
                required={required}
                InputProps={buildInputProps()}
                disabled={disabled}
                {...textInputProps}
            />
        </div>
    );
};

export default DomSelectorInput;
