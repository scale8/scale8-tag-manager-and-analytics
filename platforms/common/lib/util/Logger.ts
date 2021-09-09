import UserDebugMode from '../../../providers/Scale8/src/core/lib/UserDebugMode';

export default class Logger {
    private static output(
        level: string,
        backgroundColor: string,
        fontColor: string,
        ...objs: any
    ): void {
        console.log(
            `%cS8 ${level}`,
            `background: ${backgroundColor}; color: ${fontColor}; font-size: 0.9em; padding: 4px`,
            ...objs,
        );
    }

    public static interpreter(...objs: any): void {
        if (UserDebugMode.isEnabled()) {
            this.output('Sandbox', '#27c8a1', '#ffffff', ...objs);
        }
    }

    public static info(...objs: any): void {
        if (UserDebugMode.isEnabled()) {
            this.output('Info', '#dedede', '#606060', ...objs);
        }
    }

    public static debug(...objs: any): void {
        if (UserDebugMode.isEnabled()) {
            this.output('Debug', '#0facc9', '#ffffff', ...objs);
        }
    }

    public static warn(...objs: any): void {
        this.output('Warn', '#e96900', '#ffffff', ...objs);
    }

    public static error(...objs: any): void {
        this.output('Error', '#f66f66', '#ffffff', ...objs);
    }
}
