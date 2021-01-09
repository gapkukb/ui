import { PureComponent } from "react";
import { Namespace, unit, IBaseProps } from "../helper";

let ns = new Namespace("swiper");
const dots = ns.new("dots");
const dot = ns.new("dot");
export type DotClickHandler = (index: number, silent?: boolean) => void;
export type ISwiperDotsProps = Partial<{
  color: string;
  activeColor: string;
  dotClassName: string;
  size?: string | number;
  length: number;
  current: number;
  onClick: DotClickHandler;
}> &
  IBaseProps;

export default class extends PureComponent<ISwiperDotsProps> {
  static defaultProps = {
    current: 0,
    length: 10,
  };
  render() {
    const { current, onClick, color, activeColor, size, length, className, dotClassName } = this.props;
    const style = {
      fontSize: unit(size),
    };

    return (
      <div className={dots.cx(className)} style={style}>
        {new Array(length).fill(1).map((_, i) => (
          <div
            key={i}
            style={{ backgroundColor: i === current ? activeColor : color }}
            className={dot.cx(dotClassName, {
              [dot.m("active")]: i === current,
            })}
            onClick={() => onClick && onClick(i)}
          ></div>
        ))}
      </div>
    );
  }
}
