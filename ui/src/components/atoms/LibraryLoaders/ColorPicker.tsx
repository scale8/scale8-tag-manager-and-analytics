import { FC } from 'react';
import { ChromePicker } from 'react-color';
import { ColorPickerProps } from './LazyColorPicker';

const ColorPicker: FC<ColorPickerProps> = (props: ColorPickerProps) => {
    const { value, setValue } = props;

    return (
        <ChromePicker
            color={value}
            onChangeComplete={(color) => {
                setValue(color.hex);
            }}
            disableAlpha
        />
    );
};
export default ColorPicker;
