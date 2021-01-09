import { Component, ReactNode, CSSProperties } from "react";
import { IBaseProps, Namespace } from "../helper";

const ns = new Namespace("date");

export type IDatePickerProps = Partial<{
  value: string;
}> &
  IBaseProps;

export class DatePicker extends Component<IDatePickerProps> {
  static defaultProps: IDatePickerProps = {
    style: {},
    className: "",
  };
  constructor(props: IDatePickerProps) {
    super(props);
    this.method = this.method.bind(this);
  }
  method() {}
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    const { className, style } = this.props;
    const classes = ns.cx(ns.m("name"), {}, className);
    return (
      <div className={classes} style={style}>
        {}
      </div>
    );
  }
}

export default DatePicker;
