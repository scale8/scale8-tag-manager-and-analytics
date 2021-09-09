export default class ActionInterpreterLoader {
    public static async load() {
        const actionInterpreter = await import('./ActionInterpreter');
        return new actionInterpreter.default();
    }
}
