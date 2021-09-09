export default class Loader {
    public static loadJS(
        uri: string,
        context: Window,
        success?: () => void,
        error?: () => void,
    ): void {
        const tag = context.document.createElement('script');
        tag.src = uri;
        tag.async = true;
        if (success !== undefined) {
            tag.onload = () => success();
        }
        if (error !== undefined) {
            tag.onerror = () => error();
        }
        context.document.head.appendChild(tag);
    }

    public static injectJS(js: string, iframe?: HTMLIFrameElement): HTMLIFrameElement {
        const frm = iframe === undefined ? document.createElement('iframe') : iframe;
        frm.contentWindow?.document.open();
        frm.contentWindow?.document.write(js);
        frm.contentWindow?.document.close();
        return frm;
    }
}
