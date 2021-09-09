export default class Scheduler {
    private static readonly tasks: Map<string, number> = new Map();

    public static add(name: string, task: () => void, runEveryMs: number, runImmediately = false) {
        if (runImmediately) task();
        this.tasks.set(name, window.setInterval(task, runEveryMs));
    }

    public static cancel(name: string) {
        window.clearInterval(this.tasks.get(name));
        this.tasks.delete(name);
    }
}
