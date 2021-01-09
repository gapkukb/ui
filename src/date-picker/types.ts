import { types } from "@babel/core";

export type Nullable<T> = T extends Array<infer U>
  ? Array<U | null>
  : T extends Object
  ? { [P in keyof T]: T[P] | null }
  : T | null;
export type PartialWithRequire<T extends Object, K extends keyof T = never> = Partial<T> & Pick<T, K>;
export type SingleDate = string | number | Date;
export type SingleTime = string;
export type RangeDate = Nullable<SingleDate>;
export type RangeTime = [SingleTime, SingleTime];

export type DateTuple = [Date, Date];
export type DateNullTuple = Nullable<DateTuple>;
export type StringTuple = [string, string];
export type StringNullTuple = Nullable<StringTuple>;
export type NumberTuple = [number, number];
export type NumberNullTuple = Nullable<NumberTuple>;

export type IValueType = "date" | "number" | "string";
export type RangeType = "start" | "end";
export type IPickerType = "year" | "month" | "week" | "date" | "quarter";
export const RangeTypeMap = {
  START: "start",
  END: "end",
};

interface IValueTypeSingleMap {
  string: string;
  number: number;
  date: Date;
}
interface IValueTypeSingleSpecialMap {
  string: StringTuple;
  number: NumberTuple;
  date: DateTuple;
}

export interface IValueTypeRangeMap {
  string: StringNullTuple;
  number: NumberNullTuple;
  date: DateNullTuple;
}

export interface ISingleRelatedType<T extends IValueType> {
  valueType?: T;
  onChange: (date: IValueTypeSingleMap[T] | null) => void;
}

export interface ISingleSpecialRelatedType<T extends IValueType> {
  valueType?: T;
  onChange: (date: IValueTypeSingleSpecialMap[T] | null) => void;
}
export interface IRangeRelatedType<T extends IValueType> {
  valueType?: T;
  onChange: (date: IValueTypeRangeMap[T] | null) => void;
}

export interface IDisabledDateSimple<T = SingleDate> {
  min?: T;
  max?: T;
}

export type IDisabledDateFunc = (date: Date) => boolean;
export type IRangeDisabledDateFunc = (date: Date, type?: RangeType) => boolean;

interface ICommonProps<DateValue = SingleDate>
  extends Partial<{
    defaultDate: DateValue;
    valueType: IValueType;
    format: string;
    disabled: boolean;
    clearable: boolean;
    opened: boolean;
    width: string | number;
    classsName: string;
  }> {
  value: DateValue | null;
  onChange: (date: SingleDate | RangeDate | null) => void;
}

export interface IDateCellBase
  extends Partial<{
    seleted: boolean;
    current: boolean;
    disabled: boolean;
    visible: boolean;
    withinRange: boolean;
    withinHover: boolean;
  }> {
  value: Date;
  text: string | number;
}

type ITriggerCommonProps = PartialWithRequire<
  {
    text: string | StringTuple;
    format: string;
    seperator: string;
    width: string | number;
    clearable: boolean;
    disabled: boolean;
    opened: boolean;
    icon: string;
    onInputClear: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  },
  "format" | "onInputClear" | "opened"
>;

export interface IShowTimeOptionBase<T> extends Omit<ITimePickerBase<T>, "className" | "seleted" | "default"> {}
type defaultFunc<T> = (date: Date) => T;

export interface IShowTimeOption<T> extends IShowTimeOptionBase<T> {
  default?: T | defaultFunc<T>;
}
export interface IShowTimeRangeOption<T> extends IShowTimeOptionBase<T> {
  default?: [T | defaultFunc<T>, T | defaultFunc<T>];
}
export type IShowTime<T = string> = boolean | IShowTimeOption<T>;
export type IShowTimeRange<T = string> = boolean | IShowTimeRangeOption<T>;
export type IShowTimeOptionWithDefault = PartialWithRequire<IShowTimeOption<string>, "format" | "default">;

/*************SinglePicker***********/
export type IDisabledDate = IDisabledDateFunc | IDisabledDateSimple;
export type ISingleProps = ICommonProps<SingleDate> &
  Partial<{
    placeholder: string;
    disabled: IDisabledDate;
    open: () => void;
    close: () => void;
    name: string;
  }>;

/*************季度  周类型***************/

export type ISingleSpecialProps = ISingleProps & {
  value: SingleDate | RangeDate | null;
  default?: SingleDate | RangeDate;
};

export type ISinglePropsWithDefault = PartialWithRequire<
  ISingleProps,
  "format" | "valueType" | "placeholder" | "disabled"
>;

export interface ISingleTriggerProps extends ITriggerCommonProps {
  name?: string;
  value: SingleDate | null;
  placeholder: string;
  closeIcon: boolean;
}

export interface ISinglePanelProps {
  selected: Date | null;
  default: Date;
  hoverDate?: Date;
  hoverRangeDate?: DateTuple | null;
  rangeDate: DateTuple | null;
  row?: number;
  col?: number;

  confirm: (val: Date, status?: boolean) => void;
  disabeld: (val: Date) => boolean;
  change?: (type: IPickerType) => void;
}

export type ISingleDateBodyProps = Omit<ISinglePanelProps, "change">;

/************* CombineRangePicker and RangePicker *************/

export type IRangeProps = ICommonProps<RangeDate> &
  Partial<{
    placeholder: StringTuple;
    disabled: IRangeDisabledDateFunc | IDisabledDateSimple;
    open: (type?: RangeType) => void;
    close: (type?: RangeType) => void;
    name: StringTuple;
    span: number;
  }>;

export type IRangePropsWithDefault = PartialWithRequire<
  IRangeProps,
  "format" | "valueType" | "placeholder" | "disabled"
>;

export interface IRangeTriggerProps extends ITriggerCommonProps {
  value: RangeDate | null;
  placeholder: StringTuple;
  name?: StringTuple;
}

export interface IRangePanelProps {
  seleted: DateNullTuple;
  default: DateTuple;
  hover?: Date;
  hoverRange?: DateTuple | null;
  rangeDate: DateTuple | null;
  disabledFrom: (date: Date) => boolean;
  disabledTo: (date: Date) => boolean;
  confirm: (val: DateNullTuple, status?: boolean) => boolean;
}

/*************** TimePicker **************** */

type ITimePickerBase<T> = Partial<{
  seletedDate: Date | null;
  stepByhour: number;
  stepByMinute: number;
  stepBySecond: number;
  default: T;
  format: string;
  disabled: boolean;
  clearable: boolean;
  opened: boolean;
  with: string | number;
  className: string;
}>;

interface ITimePickerProps<T = SingleTime>
  extends ITimePickerBase<T>,
    Partial<{
      closeIcon: boolean;
      autocomplete: boolean;
      disabledTime: IDisabledTime;
      onOpen: Function;
      onClose: Function;
    }> {
  value: T;
  change: (date: T) => void;
}

export interface ISingleTimePickerProps extends ITimePickerProps<SingleTime> {
  name?: string;
  placeholder: string;
}

export type ISingleTimePickerPropsWithProps = PartialWithRequire<ISingleTimePickerProps, "format" | "placeholder">;
export interface ICombinedTimeRangePickerProps extends ITimePickerProps<RangeTime> {
  name?: StringTuple;
  placeholder?: StringTuple;
}

export type ICombinedTimeRangePickerPropsWithDefault = PartialWithRequire<
  ICombinedTimeRangePickerProps,
  "format" | "placeholder"
>;

export interface ITimeRangePickerProps extends ICombinedTimeRangePickerProps {
  onOpen?: (type?: RangeType) => void;
  onClose?: (type?: RangeType) => void;
}

export type ITimeRangePickerPropsWithDefault = PartialWithRequire<ITimeRangePickerProps, "format" | "placeholder">;

export interface ITimePickerTriggerProps<T = SingleTime> extends Omit<ITimePickerProps<T>, "value" | "onChange"> {
  seleted: T;
  confirm: (value: T, status?: boolean) => void;
}

export interface ITimePanelProps<T = SingleTime> {
  selected: T;
  confirm: (val: T, status?: boolean) => void;
  format: string;
  disabledTimeOption: IDisabledTimeOption;
  default?: T;
  stepByhour?: number;
  stepByMinute?: number;
  stepBySecond?: number;
  footless?: boolean;
}

export interface ICombinedTimePanelProps extends Omit<ITimePanelProps<RangeTime>, "disabledTimeOption"> {
  from: IDisabledTimeOption;
  to: IDisabledTimeOption;
}

export type IDisabledTimeOption = Partial<{
  disabledHours: () => number[];
  disabledMinutes: (hour: number) => number[];
  disabledSeconds: (hour: number, minute: number) => number[];
}>;

export type IDisabledTime = (date?: Date | null, type?: RangeType) => IDisabledTimeOption;
export type ITimeUnitType = "hour" | "minute" | "second";
export const enum Week {
  Sunday,
  Monday,
  TuesDay,
  WendnesDay,
  Thursday,
  Friday,
  Saturday,
}

export interface IWeekOption {
  beginAt: Week;
}

type DateLike = Date | number;

export interface IGenerateDateConfig {
  set: (date: DateLike, num: number, option?: IWeekOption) => Date;
  get: (date: DateLike, option?: IWeekOption) => number;
  offset: (date: DateLike, num: number) => Date;
  equal: (dateLeft: Date, dateRight: Date) => boolean;
  from: (date: DateLike, option?: IWeekOption) => Date;
  to: (date: DateLike, option?: IWeekOption) => Date;
  circleEndDate?: (date: DateLike) => Date;
}
