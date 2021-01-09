import { Children, cloneElement, CSSProperties, Component, Fragment, ReactNode } from "react";
import { unit, Namespace, cx } from "../helper";
import Dots, { ISwiperDotsProps } from "./dots";
let ns = new Namespace("swiper");
let nns = ns.new("items");
let nnns = ns.new("item");

export type SwiperCallback = (to: number, from?: number, dom?: HTMLDivElement) => boolean;
function eventName(): string {
  var t;
  var transEndEventNames: Record<string, string> = {
    transition: "transitionend",
    WebkitTransition: "webkitTransitionEnd",
    OTransition: "oTransitionEnd otransitionend",
  };

  for (t in transEndEventNames) {
    if (document.body.style[t as any] !== undefined) {
      return transEndEventNames[t];
    }
  }
  return "";
}

export type ISwiperProps = Partial<{
  step: NumberLike;
  duration: NumberLike;
  autoplay: boolean;
  interval: NumberLike;
  arrows: boolean;
  showArrows: boolean;
  showDots: boolean;
  dotsClassName: string;
  dotStyle: CSSProperties;
  width: NumberLike;
  height: NumberLike;
  onChangeBefore: SwiperCallback;
  onChanged: SwiperCallback;
}> &
  ISwiperDotsProps;
export interface ISwiperState {
  current: number;
}
export class Swiper extends Component<ISwiperProps> {
  timer: number = 0;
  outer!: HTMLDivElement;
  inner!: HTMLDivElement;
  count: number = 0;
  moving: boolean = false;
  from: number = 0;
  to: number = 0;
  static defaultProps: ISwiperProps = {
    showDots: true,
    showArrows: true,
    interval: 4000,
    step: "100%",
    duration: 300,
    autoplay: true,
  };
  state: ISwiperState = {
    current: 0,
  };
  getOuter = (dom: HTMLDivElement) => {
    this.outer = dom;
  };
  getInner = (dom: HTMLDivElement) => {
    this.inner = dom;
  };
  cloneChildren = (children?: ReactNode): ReactNode => {
    var count = (this.count = Children.count(children));
    if (count <= 1) return children;
    this.count += 2;
    let cloned = new Array(this.count);

    Children.forEach(children, (child, index) => {
      cloned[index + 1] = child;
      if (index === 0) cloned[count + 1] = child;
      else if (index === count - 1) cloned[0] = child;
    });
    return cloned;
  };
  private translateEnd = () => {
    this.moving = false;
    const { onChanged } = this.props;
    const { current } = this.state;
    if (this.to === this.count - 2 || this.to <= -1) {
      this.goto(current, true);
      // console.log(`静默平移`);
    } else {
    }
    onChanged && onChanged(this.from, current, this.inner);
  };
  private go = (step: number) => {
    if (this.moving) return;
    this.goto(this.state.current + step);
  };

  goto = (current: number, silent: boolean = false) => {
    if (this.count <= 1) return;
    const { onChangeBefore, duration } = this.props;
    if (!silent) {
      var count = this.count - 2;
      this.from = this.state.current;
      this.to = current;
      var to = (current + count) % count;
      this.setState({
        current: to,
      });
      if (onChangeBefore && !silent && !onChangeBefore(this.from, to, this.inner)) return;
    }

    this.moving = !silent;
    this.inner.style.transitionDuration = silent ? "0ms" : unit(duration, "ms");
    this.inner.style.transform = `translate3d(${current * -1 * 100}%,0,0)`;
  };

  private autopaly = () => {
    this.go(1);
    this.startAutoPlay();
  };
  private startAutoPlay = () => {
    if (!this.props.autoplay || this.count < 2) return;
    this.timer = window.setTimeout(this.autopaly, Number(this.props.interval));
  };
  private clearAutoPlay = () => {
    clearTimeout(this.timer);
  };
  init = () => {
    this.clearAutoPlay();
    this.startAutoPlay();
  };
  componentDidMount() {
    this.inner.addEventListener(eventName(), this.translateEnd);
    this.init();
  }
  componentDidUpdate(prevProps: ISwiperProps, prevState: ISwiperState) {
    if (prevProps.children === this.props.children) return;
    this.init();
  }
  componentWillUnmount() {
    this.inner.removeEventListener(eventName(), this.translateEnd);
    this.clearAutoPlay();
  }
  render() {
    let {
      step,
      showDots,
      children,
      style,
      className,
      dotStyle,
      dotClassName,
      dotsClassName,
      color,
      activeColor,
      size,
      width,
      height,
      showArrows,
    } = this.props;
    const { current } = this.state;
    const classes = ns.cx(className);
    const cloned = this.cloneChildren(children);
    const count = this.count;
    const real = count > 1 ? count - 2 : count;
    const mergeStyle = {
      width: unit(width),
      height: unit(height),
      ...style,
    };

    return (
      <div
        ref={this.getOuter}
        className={classes}
        style={mergeStyle}
        onMouseEnter={this.clearAutoPlay}
        onMouseLeave={this.startAutoPlay}
      >
        {showArrows && count > 1 && (
          <Fragment>
            <div className={cx(ns.e("ctrl"), ns.e("prev"))} onClick={() => this.go(-1)}>
              左
            </div>
            <div className={cx(ns.e("ctrl"), ns.e("next"))} onClick={() => this.go(1)}>
              右
            </div>
          </Fragment>
        )}
        <div
          ref={this.getInner}
          className={nns.cx()}
          style={
            count > 1
              ? {
                  position: "relative",
                  left: count > 1 ? unit("-" + step) : 0,
                }
              : {}
          }
        >
          {Children.map(cloned, (child: any, index: any) => {
            const { className, ...props } = child.props;
            return cloneElement(child, {
              key: index,
              className: nnns.cx(className),
              ...props,
            });
          })}
        </div>
        {showDots && (
          <Dots
            size={size}
            color={color}
            activeColor={activeColor}
            className={dotsClassName}
            dotClassName={dotClassName}
            style={dotStyle}
            current={(current + real) % real}
            length={real}
            onClick={this.goto}
          ></Dots>
        )}
      </div>
    );
  }
}

export default Swiper;
