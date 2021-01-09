import { Component, ReactNode } from "react";
import Button from "../button";
import { IBaseProps, makePager, pagerCtrl } from "../helper";
import { Namespace, cx } from "../helper";

const ns = new Namespace("pager");
export type TPageChangeCallback = (detail: Required<Pick<IPagerProps, "current" | "size">>) => any;
export type TPageFormater = (total: number, size: number, current: number) => ReactNode;
export type IPagerProps = IBaseProps &
  Partial<{
    current: number;
    total: number;
    size: number;
    pages: number;
    max: number;
    step: number;
    sizeOption: number[];
    jumper: boolean;
    buttonClassName: string;
    formater: TPageFormater;
    onChange: TPageChangeCallback;
    button: ReactNode;
  }>;

export class Pager extends Component<Required<IPagerProps>> {
  static defaultProps: IPagerProps = {
    current: 1,
    total: 0,
    size: 10,
    max: 10,
    jumper: true,
    step: 10,
  };
  state = {
    pages: Math.ceil(this.props.total / this.props.size),
  };
  constructor(props: Required<IPagerProps>) {
    super(props);
    // this.handlerClick = this.handlerClick.bind(this);
  }
  handlerClick: TPageChangeCallback = (detail) => {
    let { step, current: cur } = this.props;
    let { size, current } = detail;
    if (cur === current) return;
    const { pages } = this.state;
    if (current === pagerCtrl.UP) {
      cur -= step;
    } else if (current === pagerCtrl.DOWN) {
      cur += step;
    } else if (current === pagerCtrl.PREV) {
      cur -= 1;
    } else if (current === pagerCtrl.NEXT) {
      cur += 1;
    } else {
      cur = current;
    }
    cur = cur < 1 ? 1 : cur > pages ? pages : cur;
    this.props.onChange({ size, current: cur });
  };
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    let {
      className,
      style,
      total,
      current,
      size,
      sizeOption,
      jumper,
      max,
      buttonClassName,
      formater: format,
      onChange,
      button,
    } = this.props;

    const classes = ns.cx(className);
    const { pages } = this.state;
    let ary = makePager(current, pages, max);
    return (
      <div className={classes} style={style}>
        <div className={ns.e("name")}>{format ? format(total, size, current) : `共${total}条，每页${size}条`}</div>
        {sizeOption && (
          <select>
            {sizeOption.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        )}
        {ary.map((item) => (
          <Button
            className={cx(
              {
                [ns.e("active")]: item === current,
                [ns.e("prev")]: item === pagerCtrl.PREV,
                [ns.e("next")]: item === pagerCtrl.NEXT,
                [ns.e("up")]: item === pagerCtrl.UP,
                [ns.e("down")]: item === pagerCtrl.DOWN,
              },
              buttonClassName
            )}
            disabled={(item === pagerCtrl.PREV && current === 1) || (item === pagerCtrl.NEXT && current === pages)}
            key={item}
            onClick={() => this.handlerClick({ size, current: item })}
          >
            {item}
          </Button>
        ))}
        {/* <Button disabled={current === 1} className={ns.e("prev")} icon="abc" /> */}
        {jumper && (
          <div>
            跳至：
            <input placeholder={current.toString()} />
          </div>
        )}
      </div>
    );
  }
}

export default Pager;
