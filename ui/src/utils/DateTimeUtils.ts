import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    differenceInCalendarDays,
    differenceInHours,
    differenceInMinutes,
    getDaysInMonth,
    isSameMinute,
    isToday,
    parse,
    subDays,
    subHours,
    subMinutes,
    subMonths,
} from 'date-fns';

const oneMsTo24h = 86400000 - 1;

export type UTCTimestamp = number;

const apiStringDateFormat = "yyyy-MM-dd'T'HH:mm:ss";
const dataMapDateFormat = 'yyyy-MM-dd HH:mm:ss.SSS';

const now = new Date();

const dateToElements = (d: Date) => ({
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds(),
    dow: d.getDay(),
});

const dateToUTCElements = (d: Date) => ({
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    seconds: d.getUTCSeconds(),
    milliseconds: d.getUTCMilliseconds(),
    dow: d.getUTCDay(),
});

const dateToPrintableUTCElements = (d: Date) => {
    const e = dateToUTCElements(d);

    const month_names = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month_names_short = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const day_of_week = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const day_of_week_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const hours120 = e.hour % 12;
    const hours12 = hours120 === 0 ? 12 : hours120;

    return {
        year: `${e.year}`,
        month: `${e.month + 1}`.padStart(2, '0'),
        monthLong: month_names[e.month],
        monthShort: month_names_short[e.month],
        date: `${e.date}`.padStart(2, '0'),
        hour: `${e.hour}`.padStart(2, '0'),
        hour12: `${hours12}`.padStart(2, '0'),
        u_date: `${e.date}`,
        u_hour12: `${hours12}`,
        minute: `${e.minute}`.padStart(2, '0'),
        seconds: `${e.seconds}`.padStart(2, '0'),
        milliseconds: `${e.milliseconds}`.padStart(3, '0'),
        dowLong: day_of_week[e.dow],
        dowShort: day_of_week_short[e.dow],
        ampm: e.hour >= 12 ? 'pm' : 'am',
    };
};

//
// Conversion
//

export const dateToUTCTimestamp = (d: Date, displayValueToUTC = false): UTCTimestamp => {
    const dElements = displayValueToUTC ? dateToElements(d) : dateToUTCElements(d);

    return Date.UTC(
        dElements.year,
        dElements.month,
        dElements.date,
        dElements.hour,
        dElements.minute,
        dElements.seconds,
        dElements.milliseconds,
    );
};

export const stringToUTCTimestamp = (v: string, format = apiStringDateFormat): UTCTimestamp => {
    return dateToUTCTimestamp(parse(`${v} +0000`, `${format} xx`, now));
};

export const dataMapStringToUTCTimestamp = (v: string): UTCTimestamp => {
    return stringToUTCTimestamp(v, dataMapDateFormat);
};

//
// is/in/add/subtract
//

export const isTodayUTC = (value: UTCTimestamp): boolean => isToday(new Date(value));

export const isSameMonthUTC = (left: UTCTimestamp, right: UTCTimestamp): boolean => {
    const leftElements = dateToUTCElements(new Date(left));
    const rightElements = dateToUTCElements(new Date(right));

    return leftElements.month === rightElements.month;
};

export const getTimezoneOffset = (): number => now.getTimezoneOffset();

export const addDaysUTC = (value: UTCTimestamp, days: number): UTCTimestamp =>
    dateToUTCTimestamp(addDays(new Date(value), days));

export const subDaysUTC = (value: UTCTimestamp, days: number): UTCTimestamp =>
    dateToUTCTimestamp(subDays(new Date(value), days));

export const addHoursUTC = (value: UTCTimestamp, hours: number): UTCTimestamp =>
    dateToUTCTimestamp(addHours(new Date(value), hours));

export const subHoursUTC = (value: UTCTimestamp, hours: number): UTCTimestamp =>
    dateToUTCTimestamp(subHours(new Date(value), hours));

export const addMinutesUTC = (value: UTCTimestamp, minutes: number): UTCTimestamp =>
    dateToUTCTimestamp(addMinutes(new Date(value), minutes));

export const subMinutesUTC = (value: UTCTimestamp, minutes: number): UTCTimestamp =>
    dateToUTCTimestamp(subMinutes(new Date(value), minutes));

export const addMonthsUTC = (value: UTCTimestamp, months: number): UTCTimestamp =>
    dateToUTCTimestamp(addMonths(new Date(value), months));

export const subMonthsUTC = (value: UTCTimestamp, months: number): UTCTimestamp =>
    dateToUTCTimestamp(subMonths(new Date(value), months));

//
// utility functions
//

export const getDaysInMonthUTC = (d: Date): number => {
    const dElements = dateToUTCElements(d);
    return getDaysInMonth(new Date(Date.UTC(dElements.year, dElements.month, 15, 0, 0, 0, 0)));
};

export const getDaysInMonthFromTimestamp = (value: UTCTimestamp): UTCTimestamp =>
    getDaysInMonthUTC(new Date(value));

export const differenceDaysUTC = (left: UTCTimestamp, right: UTCTimestamp): number =>
    differenceInCalendarDays(new Date(left), new Date(right));

export const differenceMinutesUTC = (left: UTCTimestamp, right: UTCTimestamp): number =>
    differenceInMinutes(new Date(left), new Date(right));

export const differenceHoursUTC = (left: UTCTimestamp, right: UTCTimestamp): number =>
    differenceInHours(new Date(left), new Date(right));

export const getMinutesUTC = (value: UTCTimestamp): UTCTimestamp => {
    const elements = dateToUTCElements(new Date(value));

    return elements.minute;
};

export const getHoursUTC = (value: UTCTimestamp): UTCTimestamp => {
    const elements = dateToUTCElements(new Date(value));

    return elements.hour;
};

export const setMinutesUTC = (value: UTCTimestamp, minutes: number): UTCTimestamp => {
    const elements = dateToUTCElements(new Date(value));

    return Date.UTC(
        elements.year,
        elements.month,
        elements.date,
        elements.hour,
        minutes,
        elements.seconds,
        elements.milliseconds,
    );
};

export const setHoursUTC = (value: UTCTimestamp, hours: number): UTCTimestamp => {
    const elements = dateToUTCElements(new Date(value));

    return Date.UTC(
        elements.year,
        elements.month,
        elements.date,
        hours,
        elements.minute,
        elements.seconds,
        elements.milliseconds,
    );
};

//
// start / end functions
//

export const startOfDayUTC = (d: Date): UTCTimestamp => {
    const dElements = dateToUTCElements(d);

    return Date.UTC(dElements.year, dElements.month, dElements.date, 0, 0, 0, 0);
};

export const stringToStartOfDayUTC = (v: string, format = apiStringDateFormat): UTCTimestamp => {
    const dElements = dateToUTCElements(new Date(stringToUTCTimestamp(v, format)));

    return Date.UTC(dElements.year, dElements.month, dElements.date, 0, 0, 0, 0);
};

export const startOfMonthUTC = (d: Date): UTCTimestamp => {
    const dElements = dateToUTCElements(d);

    return Date.UTC(dElements.year, dElements.month, 1, 0, 0, 0, 0);
};

const endOfMonthUTC = (d: Date): UTCTimestamp => {
    const dElements = dateToUTCElements(d);
    return Date.UTC(dElements.year, dElements.month, getDaysInMonthUTC(d), 0, 0, 0, 0) + oneMsTo24h;
};

export const startOfMinuteUTC = (value: UTCTimestamp): UTCTimestamp => {
    const elements = dateToUTCElements(new Date(value));

    return Date.UTC(
        elements.year,
        elements.month,
        elements.date,
        elements.hour,
        elements.minute,
        0,
        0,
    );
};

export const startOfDayFromTimestamp = (value: UTCTimestamp): UTCTimestamp =>
    startOfDayUTC(new Date(value));

export const endOfDayFromTimestamp = (value: UTCTimestamp): UTCTimestamp =>
    startOfDayUTC(new Date(value)) + oneMsTo24h;

export const startOfMonthFromTimestamp = (value: UTCTimestamp): UTCTimestamp =>
    startOfMonthUTC(new Date(value));

export const endOfMonthFromTimestamp = (value: UTCTimestamp): UTCTimestamp =>
    endOfMonthUTC(new Date(value));

//
// constant values
//

export const UTCCurrent = (): UTCTimestamp => dateToUTCTimestamp(new Date());
export const UTCNow: UTCTimestamp = dateToUTCTimestamp(now);
export const yearUTC = now.getUTCFullYear();
export const startOfTodayUTC = startOfDayUTC(now);
export const startOfThisMonthUTC = startOfMonthUTC(now);

//
// Extra Functions
//
export const isThisMonthUTC = (value: UTCTimestamp): boolean =>
    isSameMonthUTC(value, startOfThisMonthUTC);

//
// Display functions
//

export const timestampDisplay = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.date}/${e.month}/${e.year}, ${e.hour}:${e.minute}:${e.seconds}`;
};

export const timestampDisplayDate = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.date}/${e.month}/${e.year}`;
};

export const dateStringDisplay = (v: string): string => {
    return timestampDisplay(dataMapStringToUTCTimestamp(v.toString()));
};

export const displayDayMonth = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.date} ${e.monthShort}`;
};

export const displayDayMonthTime = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.date} ${e.monthShort} ${e.date}:${e.minute}`;
};

export const displayFullMonth = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return e.monthLong;
};

export const displayMonthYear = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.monthLong} ${e.year}`;
};

export const displayDayDetails = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.dowShort}, ${e.u_date} ${e.monthShort}`;
};

export const displayHourDetails = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.u_hour12} ${e.ampm}`;
};

export const timestampToDataMapString = (timestamp: UTCTimestamp): string => {
    const e = dateToPrintableUTCElements(new Date(timestamp));
    return `${e.year}-${e.month}-${e.date} ${e.hour}:${e.minute}:${e.seconds}.${e.milliseconds}`;
};

export { isSameMinute as isSameMinuteTimestamp };
