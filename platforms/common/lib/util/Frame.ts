import ElementExtended, { StyleKey } from './ElementExtended';

export default class Frame {
    public static createFrame(id: string, width = 0, height = 0): HTMLIFrameElement {
        const iframe = document.createElement('iframe');
        ElementExtended.applyAttributes(
            iframe,
            new Map<string, string>([
                ['id', id],
                ['width', `${width}px`],
                ['height', `${height}px`],
                ['hspace', '0'],
                ['vspace', '0'],
                ['marginWidth', '0'],
                ['marginHeight', '0'],
                ['scrolling', 'no'],
                ['frameBorder', '0'],
                ['allowtransparency', 'true'],
            ]),
        );
        ElementExtended.applyStyles(
            iframe,
            new Map<StyleKey, string>([
                ['width', `${width}px`],
                ['height', `${height}px`],
            ]),
        );
        return iframe;
    }

    public static createFullSizeFrame(src: string): HTMLIFrameElement {
        const iframe = document.createElement('iframe');
        ElementExtended.applyAttributes(
            iframe,
            new Map<string, string>([
                ['src', src],
                ['width', '100%'],
                ['height', '100%'],
                ['hspace', '0'],
                ['vspace', '0'],
                ['marginWidth', '0'],
                ['marginHeight', '0'],
                ['scrolling', 'no'],
                ['frameBorder', '0'],
                ['allowtransparency', 'true'],
            ]),
        );
        ElementExtended.applyStyles(
            iframe,
            new Map<StyleKey, string>([
                ['width', '100%'],
                ['height', '100%'],
            ]),
        );
        return iframe;
    }

    public static createHiddenFrame(
        src: string,
        success?: () => void,
        error?: () => void,
    ): HTMLIFrameElement {
        const iframe = document.createElement('iframe');
        if (success !== undefined) {
            iframe.onload = () => success();
        }
        if (error !== undefined) {
            iframe.onerror = () => error();
        }
        ElementExtended.applyAttributes(
            iframe,
            new Map<string, string>([
                ['src', src],
                ['width', '0'],
                ['height', '0'],
                ['hspace', '0'],
                ['vspace', '0'],
                ['marginWidth', '0'],
                ['marginHeight', '0'],
                ['scrolling', 'no'],
                ['frameBorder', '0'],
                ['allowtransparency', 'true'],
            ]),
        );
        ElementExtended.applyStyles(
            iframe,
            new Map<StyleKey, string>([
                ['width', '100%'],
                ['height', '100%'],
            ]),
        );
        return iframe;
    }
}
