import TagManager from '../lib/TagManager';
import RevisionStatusManager from './RevisionStatusManager';
import ElementExtended, { StyleKey } from '../../../../../common/lib/util/ElementExtended';
import Frame from '../../../../../common/lib/util/Frame';
import UserDebugMode from '../lib/UserDebugMode';
import Context from '../lib/Context';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';
import { TagCode } from '../../../../../common/types/Types';
import { getByTagCode } from '../../../../../common/lib/util/TagElement';
import { messageFromFrameEvent } from '../funcs/MessageFromFrameEvent';

type FrameEvent = {
    isS8FrameEvent: boolean;
    event: string;
    payload: any;
};

export default class DebugLayer {
    private static existingMarginBottom = 0;
    private static resizeStartY = 0;
    private static resizeStartHeight = 0;
    private static readonly initialDebugWindowHeight = 300;
    private static topWindow = getTopWindow();
    private static topWindowBody = getTopWindow().document.body;

    private static debugWindowDiv: HTMLElement | null = null;
    private static debugWindowOverlay: HTMLElement | null = null;
    private static debugWindowIframe: HTMLIFrameElement | null = null;

    public static render(): void {
        this.existingMarginBottom = this.getStyleIntValue(this.topWindowBody, 'margin-bottom');
        this.setPageMarginBottom(this.existingMarginBottom + this.initialDebugWindowHeight);
        this.buildInspectWindow();
        this.buildHighlighterFrames();
        this.addIframeEventsListeners();
    }

    private static closeDebugWindow(): void {
        this.setPageMarginBottom(this.existingMarginBottom);
        ElementExtended.hide(this.getDebugWindowDiv());
    }

    private static setPageMarginBottom(height: number) {
        ElementExtended.applyStyle(this.topWindowBody, 'marginBottom', `${height}px`);
    }

    private static buildInspectWindow(): void {
        this.buildDebugWindowDiv();
        this.debugWindowIframe = Frame.createFullSizeFrame(
            `${Context.getUIEndpoint()}/debug-frame`,
        );
        this.buildDebugWindowOverlay();

        this.getDebugWindowDiv().appendChild(this.getDebugWindowResizer());
        this.getDebugWindowDiv().appendChild(this.getDebugWindowIframe());
        this.topWindowBody.appendChild(this.getDebugWindowOverlay());
        this.topWindowBody.appendChild(this.getDebugWindowDiv());
    }

    private static getStyleValue(el: HTMLElement, property: string): string {
        return this.topWindow.getComputedStyle(el).getPropertyValue(property);
    }

    private static getStyleIntValue(el: HTMLElement, property: string): number {
        return parseInt(this.getStyleValue(el, property), 10);
    }

    private static buildDebugWindowDiv(): void {
        this.debugWindowDiv = document.createElement('div');
        ElementExtended.applyStyles(
            this.debugWindowDiv,
            new Map<StyleKey, string>([
                ['position', 'fixed'],
                ['height', `${this.initialDebugWindowHeight}px`],
                ['width', '100%'],
                ['bottom', '0'],
                ['background', '#fafafa'],
                ['zIndex', '2147483647'],
            ]),
        );
    }

    private static buildDebugWindowOverlay(): void {
        this.debugWindowOverlay = document.createElement('div');
        ElementExtended.applyStyles(
            this.debugWindowOverlay,
            new Map<StyleKey, string>([
                ['position', 'fixed'],
                ['height', '100%'],
                ['width', '100%'],
                ['top', '0'],
                ['background', 'transparent'],
                ['display', 'none'],
                ['zIndex', '2147483647'],
            ]),
        );
    }

    private static getDebugWindowResizer(): HTMLElement {
        const resize = (e: MouseEvent) => {
            const newHeight = this.resizeStartHeight - e.clientY + this.resizeStartY;
            ElementExtended.applyStyle(this.getDebugWindowDiv(), 'height', `${newHeight}px`);
            this.setPageMarginBottom(this.existingMarginBottom + newHeight);
        };

        const stopResize = () => {
            this.topWindow.removeEventListener('mousemove', resize, false);
            this.topWindow.removeEventListener('mouseup', stopResize, false);
            ElementExtended.applyStyle(this.getDebugWindowDiv(), 'borderTop', '0');
            ElementExtended.show(this.getDebugWindowIframe());
            ElementExtended.hide(this.getDebugWindowOverlay());
        };

        const initResize = (e: MouseEvent) => {
            e.stopPropagation();
            ElementExtended.hide(this.getDebugWindowIframe());
            ElementExtended.show(this.getDebugWindowOverlay());
            ElementExtended.applyStyle(this.getDebugWindowDiv(), 'borderTop', '1px solid #dadada');
            this.resizeStartY = e.clientY;
            this.resizeStartHeight = parseInt(
                this.topWindow
                    .getComputedStyle(this.getDebugWindowDiv())
                    .getPropertyValue('height'),
            );
            this.topWindow.addEventListener('mousemove', resize, false);
            this.topWindow.addEventListener('mouseup', stopResize, false);
        };

        const resizer = document.createElement('div');
        ElementExtended.applyStyles(
            resizer,
            new Map<StyleKey, string>([
                ['width', '100%'],
                ['height', '5px'],
                ['background', 'transparent'],
                ['position', 'absolute'],
                ['top', '0'],
                ['zIndex', '2147483647'],
                ['cursor', 'row-resize'],
            ]),
        );
        resizer.addEventListener('mousedown', initResize, false);

        return resizer;
    }

    private static getDebugWindowDiv(): HTMLElement {
        if (this.debugWindowDiv === null) {
            throw new Error('Cannot find debug html element');
        }
        return this.debugWindowDiv;
    }

    private static getDebugWindowOverlay(): HTMLElement {
        if (this.debugWindowOverlay === null) {
            throw new Error('Cannot find debug html element');
        }
        return this.debugWindowOverlay;
    }

    private static getDebugWindowIframe(): HTMLIFrameElement {
        if (this.debugWindowIframe === null) {
            throw new Error('Cannot find debug html element');
        }
        return this.debugWindowIframe;
    }

    private static getHighlighterByTagCode(tagCode: TagCode): HTMLElement {
        const tagElement = getByTagCode(tagCode);
        const highlighter = tagElement.querySelector('.highlighter') as HTMLElement | null;
        if (highlighter === null) {
            throw new Error(`Failed to find tag highlighter ${tagCode.code}@${tagCode.index}`);
        }
        return highlighter;
    }

    private static toggleHighlighters(show: boolean): void {
        TagManager.getRegisteredTags().forEach((tagCode) => {
            ElementExtended.applyStyle(
                this.getHighlighterByTagCode(tagCode),
                'display',
                show ? 'block' : 'none',
            );
        });
    }

    private static buildHighlighterFrames(): void {
        TagManager.getRegisteredTags().forEach((tagCode) => {
            this.getHighlighterByTagCode(tagCode).appendChild(
                Frame.createFullSizeFrame(
                    `${Context.getUIEndpoint()}/debug-highlighter?code=${tagCode.code}&index=${
                        tagCode.index
                    }`,
                ),
            );
        });
    }

    private static frameEventFromMessage(msg: string | { [k: string]: any }): FrameEvent | null {
        try {
            const objEvent = typeof msg === 'object' ? msg : JSON.parse(msg);
            return objEvent.isS8FrameEvent ? (objEvent as FrameEvent) : null;
        } catch (err) {
            return null;
        }
    }

    private static addIframeEventsListeners(): void {
        // Listen to message from child window
        this.topWindow.addEventListener('message', (e) => {
            const frameEvent = this.frameEventFromMessage(e.data);
            if (frameEvent === null) return;
            const messageTarget = RevisionStatusManager.getMessageTarget();

            if (frameEvent.event === 'ready') {
                RevisionStatusManager.setMessageTarget(this.getDebugWindowIframe());
                RevisionStatusManager.sendRevisionStatus(true);
            }
            if (frameEvent.event === 'highlighterClick') {
                if (messageTarget === null) return;

                messageTarget.postMessage(
                    messageFromFrameEvent('selectTag', {
                        code: frameEvent.payload.code,
                        index: frameEvent.payload.index,
                    }),
                    '*',
                );
            }
            if (frameEvent.event === 'showHighlighters') {
                this.toggleHighlighters(true);
                if (messageTarget === null) return;

                messageTarget.postMessage(messageFromFrameEvent('highlightersVisible'), '*');
            }
            if (frameEvent.event === 'hideHighlighters') {
                this.toggleHighlighters(false);
                if (messageTarget === null) return;

                messageTarget.postMessage(messageFromFrameEvent('highlightersHidden'), '*');
            }
            if (frameEvent.event === 'flashTag') {
                const tagElement = getByTagCode(frameEvent.payload);
                tagElement.scrollIntoView();
                const highlighter = this.getHighlighterByTagCode(frameEvent.payload);

                const fromHidden = this.getStyleValue(highlighter, 'display') === 'none';
                if (fromHidden) {
                    ElementExtended.show(highlighter);
                }
                const iframe = highlighter.querySelector('iframe');
                if (iframe !== null && iframe.contentWindow !== null) {
                    iframe.contentWindow.postMessage(
                        messageFromFrameEvent('flash', {
                            fromHidden,
                        }),
                        '*',
                    );
                }
            }
            if (frameEvent.event === 'flashed') {
                if (frameEvent.payload.hide) {
                    ElementExtended.hide(
                        this.getHighlighterByTagCode({
                            code: frameEvent.payload.code,
                            index: frameEvent.payload.index,
                        }),
                    );
                }
            }
            if (frameEvent.event === 'close') {
                this.closeDebugWindow();
            }
            if (frameEvent.event === 'leaveDebugMode') {
                UserDebugMode.leave();
                this.closeDebugWindow();
            }
        });
    }
}
