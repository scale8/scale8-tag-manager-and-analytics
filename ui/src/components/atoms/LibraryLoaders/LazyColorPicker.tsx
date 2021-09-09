import { FC } from 'react';
import dynamic from 'next/dynamic';

export type ColorPickerProps = {
    value: string;
    setValue: (v: string) => void;
};

const LazyColorPicker: FC<ColorPickerProps> = (props: ColorPickerProps) => {
    const DynamicComponent = dynamic(() => import('./ColorPicker'));

    return <DynamicComponent {...props} />;
};
export default LazyColorPicker;
