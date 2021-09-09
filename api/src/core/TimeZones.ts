import * as moment from 'moment-timezone';

export default class TimeZones {
    public static timeZonesAsGQL(): string {
        const keys = Array.from(this.getTimeZones())
            .map((tz) => `"""*${tz[1]}*""" ${tz[0]}`)
            .join('\n');
        return `{\n${keys}\n}`;
    }

    public static getTimeZones(): Map<string, string> {
        return new Map(
            moment.tz
                .names()
                .filter((_) => _.match(/^[a-z_]+\/[a-z_]+$/i) !== null || _ === 'UTC')
                .map((_) => [
                    _.replace(/[^a-z]/gi, '_').toUpperCase(),
                    _.replace('/', ' / ').replace(/_/g, ' '),
                ]),
        );
    }

    public static isValidTimeZone(timeZone: string): boolean {
        return this.getTimeZones().has(timeZone);
    }
}
