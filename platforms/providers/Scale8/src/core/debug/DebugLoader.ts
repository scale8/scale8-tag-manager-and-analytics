export default class DebugLoader {
    public static async load(): Promise<void> {
        const debugLayer = await import('./DebugLayer');
        debugLayer.default.render();
    }
}
