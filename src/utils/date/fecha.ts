// parse or format dates

export type FechaDays = Tuple<string, 7>;
export type FechaMonths = Tuple<string, 12>;
export interface IFechaI18Settings {
  ampm: Tuple<string, 2>;
  day: FechaDays;
  shortDay: FechaDays;
  month: FechaMonths;
  shortMonth: FechaMonths;
  action(D: number): string;
}

export interface IFechaMasks {
  default: string;
  fullDate: string;
  longDate: string;
  longTime: string;
  mediumDate: string;
  mediumTime: string;
  shortDate: string;
  shortTime: string;
  [mask: string]: string;
}

interface IFechaDateInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  isPm: boolean;
  timezoneOffset: number;
}

type FechaParseFlagHandler = [string, (d: IFechaDateInfo, v: string, i18n: IFechaI18Settings) => void];
type FechaFormatFlagHandler = (date: Date, i18n: IFechaI18Settings) => string;
type FechaFormatToken =
  | "D"
  | "DD"
  | "Do"
  | "d"
  | "dd"
  | "ddd"
  | "dddd"
  | "M"
  | "MM"
  | "MMM"
  | "MMMM"
  | "YY"
  | "YYYY"
  | "h"
  | "hh"
  | "H"
  | "HH"
  | "m"
  | "mm"
  | "s"
  | "ss"
  | "S"
  | "SS"
  | "SSS"
  | "a"
  | "A"
  | "ZZ";

const token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[Aa]|"[^"]*"|'[^']*'/g;
const twoDigits = "\\d\\d?";
const threeDigits = "\\d{3}";
const fourDigits = "\\d{4}";
const word = "[^\\s]+";
const literal = /\[([^]*?)\]/;
const noop = () => {};
const day: FechaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const suffix = ["th", "st", "nd", "rd"];
const month: FechaMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const shortMonth = shorten(month, 3);
const shortDay = shorten(day, 3);

export const i18n: IFechaI18Settings = {
  shortDay,
  day,
  month,
  shortMonth,
  ampm: ["am", "pm"],
  action(D) {
    const remainder = D % 10;
    const a = D - remainder !== 10 ? 1 : 0;
    const i = remainder > 3 ? 0 : (a * D) % 10;
    return D + suffix[i];
  },
};

export const masks: IFechaMasks = {
  default: "ddd MMM DD YYYY HH:mm:ss",
  shortDate: "M/D/YY",
  mediumDate: "MMM D, YYYY",
  longDate: "MMMM D, YYYY",
  fullDate: "dddd, MMMM D, YYYY",
  shortTime: "HH:mm",
  mediumTime: "HH:mm:ss",
  longTime: "HH:mm:ss.SSS",
};

function pad(val: string | number, len = 2): string {
  return String(val).padStart(2, "0");
}

const formatToken: Record<string, FechaFormatFlagHandler> = {
  D(date) {
    return String(date.getDate());
  },
  DD(date) {
    return pad(date.getDate());
  },
  Do(date, i18n) {
    return i18n.action(date.getDate());
  },
  d(date) {
    return String(date.getDay());
  },
  dd(date) {
    return pad(date.getDay());
  },
  ddd(date, i18n) {
    return i18n.shortDay[date.getDay()];
  },
  dddd(date, i18n) {
    return i18n.day[date.getDay()];
  },
  M(date) {
    return String(date.getMonth() + 1);
  },
  MM(date) {
    return pad(date.getMonth() + 1);
  },
  MMM(date, i18n) {
    return i18n.shortMonth[date.getMonth()];
  },
  MMMM(date, i18n) {
    return i18n.month[date.getMonth()];
  },
  YY(date) {
    return pad(String(date.getFullYear()), 4).substr(2);
  },
  YYYY(date) {
    return String(date.getFullYear());
  },
  h(date) {
    return String(date.getHours() % 12 || 12);
  },
  hh(date) {
    return pad(date.getHours() % 12 || 12);
  },
  H(date) {
    return String(date.getHours());
  },
  HH(date) {
    return pad(date.getHours());
  },
  m(date) {
    return String(date.getMinutes());
  },
  mm(date) {
    return pad(date.getMinutes());
  },
  s(date) {
    return String(date.getMilliseconds());
  },
  ss(date) {
    return pad(date.getMilliseconds());
  },
  S(date) {
    return String(Math.round(date.getMilliseconds() / 100));
  },
  SS(date) {
    return pad(Math.round(date.getMilliseconds() / 10), 2);
  },
  SSS(date) {
    return pad(date.getMilliseconds(), 3);
  },
  a(date, i18n) {
    return i18n.ampm[date.getHours() < 12 ? 0 : 1];
  },
  A(date, i18n) {
    return i18n.ampm[date.getHours() < 12 ? 0 : 1].toUpperCase();
  },
  ZZ(date) {
    const o = date.getTimezoneOffset(); // 偏差-分钟
    let symbol = o > 0 ? "-" : "+";
    const timezone = Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60);
    return symbol + pad(timezone, 4);
  },
};

const parseFlags: Record<FechaFormatToken, FechaParseFlagHandler> = {
  D: [twoDigits, setDay],
  DD: [twoDigits, setDay],
  Do: [twoDigits + word, setDay],
  M: [twoDigits, setMonth],
  MM: [twoDigits, setMonth],
  YY: [
    twoDigits,
    (d, v: string) => {
      const y = parseInt(v, 10);
      const da = new Date();
      const cent = parseInt(String(da.getFullYear()).substr(0, 2), 10);
      const year = String(y > 68 ? cent - 1 : cent) + v;
      d.year = parseInt(year, 10);
    },
  ],
  h: [twoDigits, setHour],
  hh: [twoDigits, setHour],
  H: [twoDigits, setHour],
  HH: [twoDigits, setHour],
  m: [twoDigits, setMinute],
  mm: [twoDigits, setMinute],
  s: [twoDigits, setSecond],
  ss: [twoDigits, setSecond],
  YYYY: [
    fourDigits,
    (d, v) => {
      d.year = parseInt(v, 10);
    },
  ],
  S: [
    "\\d",
    (d, v) => {
      d.millisecond = parseInt(v, 10) * 100;
    },
  ],
  SS: [
    "\\d{2}",
    (d, v) => {
      d.millisecond = parseInt(v, 10) * 10;
    },
  ],
  SSS: [
    threeDigits,
    (d, v) => {
      d.millisecond = parseInt(v, 10);
    },
  ],
  d: [twoDigits, noop],
  dd: [twoDigits, noop],
  ddd: [word, noop],
  dddd: [word, noop],
  MMM: [word, monthUpdate("monthNamesShort")],
  MMMM: [word, monthUpdate("monthNames")],
  a: [word, setPm],
  A: [word, setPm],
  ZZ: [
    "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",
    (d, v) => {
      const parts = (v + "").match(/([+-]|\d\d)/gi);
      let minutes: number;

      if (parts) {
        minutes = parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === "+" ? minutes : -minutes;
      }
    },
  ],
};

function monthUpdate(arrName: string) {
  return (d: IFechaDateInfo, v: string, i18n: IFechaI18Settings) => {
    const i = (<any>i18n)[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
    if (~i) d.month = i;
  };
}

function setMonth(d: IFechaDateInfo, v: string) {
  d.month = parseInt(v, 10) - 1;
}
function setDay(d: IFechaDateInfo, v: string) {
  d.day = parseInt(v, 10);
}
function setHour(d: IFechaDateInfo, v: string) {
  d.hour = parseInt(v, 10);
}
function setMinute(d: IFechaDateInfo, v: string) {
  d.minute = parseInt(v, 10);
}
function setSecond(d: IFechaDateInfo, v: string) {
  d.second = parseInt(v, 10);
}

function setPm(d: IFechaDateInfo, v: string, i18n: IFechaI18Settings) {
  d.isPm = v.toLowerCase() === i18n.ampm[1];
}

function shorten<T>(arr: T, len: number): T {
  return (arr as any).map((i: string) => i.substr(0, len)) as T;
}
