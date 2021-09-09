export type StyleKey = Exclude<
    keyof CSSStyleDeclaration,
    | 'length'
    | 'parentRule'
    | 'getPropertyPriority'
    | 'getPropertyValue'
    | 'item'
    | 'removeProperty'
    | 'setProperty'
>;

export default class ElementExtended {
    public static applyStyle(elm: HTMLElement, styleKey: StyleKey, value: string) {
        elm.style[styleKey] = value;
    }

    public static applyStyles(elm: HTMLElement, styles: Map<StyleKey, string>) {
        styles.forEach((value, key) => {
            elm.style[key] = value;
        });
    }

    public static applyAttributes(elm: HTMLElement, attributes: Map<string, string>) {
        attributes.forEach((value, key) => {
            (elm as any)[key] = value;
        });
    }

    public static hide(elm: HTMLElement) {
        this.applyStyle(elm, 'display', 'none');
    }

    public static show(elm: HTMLElement) {
        this.applyStyle(elm, 'display', 'block');
    }
}
