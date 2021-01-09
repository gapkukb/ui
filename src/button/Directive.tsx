import { isElement } from "react-is";
import { Omit } from "utility-types";
import { Children, cloneElement, useCallback, useContext, useRef } from "react";
import Icon from "../icon";
import { Namespace } from "../helper";
import { DisabledContext } from "../disabled";
const ns = new Namespace("button");
export interface IButtonDirectiveChildProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  data?: string;
  onClick?: React.MouseEventHandler;
}

export interface ISize {
  xs: 480;
  sm: 960;
  md: 1280;
  lg: 1440;
  xl: 1920;
}
export type IButtonSize = keyof ISize;
export type IButtonType = "default" | "primary" | "secondary" | "danger" | "warning" | "error" | "success";
export type IButtonHTMLType = "button" | "submit" | "reset";
export interface IButtonDirectiveProps<ChildProps extends Omit<IButtonDirectiveChildProps, "children">> {
  size?: IButtonSize;
  type?: IButtonType;
  xxx?: string;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  bordered?: boolean;
  style?: React.CSSProperties;
  icon?: string;
  iconRight?: string;
  block?: boolean;
  children: React.ReactElement<ChildProps>;
}

export function ButtonDirective<ChildProps extends IButtonDirectiveChildProps>(
  props: IButtonDirectiveProps<ChildProps>
) {
  const disabledContext = useContext(DisabledContext);
  const {
    outline,
    type = "default",
    size = "md",
    block,
    loading,
    disabled = disabledContext.value,
    bordered = true,
    icon,
    iconRight,
    children,
  } = props;

  if (!isElement(children)) throw new Error("Button Directive child must be a element");

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const propsRef = useRef(props);
  propsRef.current = props;
  const onClick = useCallback((e: React.MouseEvent) => {
    const { loading, children } = propsRef.current;
    const { onClick } = children.props;
    if (loading || disabled) return e.preventDefault();
    onClick?.(e);
  }, []);

  const iconNode = icon ? <Icon name={icon} /> : null;
  const iconRightNode = iconRight ? <Icon name={iconRight} /> : null;

  const className = ns.cx(
    {
      [ns.e(type) + (outline ? "-outline" : "")]: type !== "default",
      [ns.e(size)]: size !== "md",
      [ns.e("block")]: block,
      [ns.e("loading")]: loading,
      // [ns.e("disabled")]: disabled,
      [ns.e("borderless")]: !bordered,
    },
    children.props.className
  );

  return cloneElement<ChildProps>(
    children,
    {
      className,
      disabled: !!(disabled || loading),
      onClick,
    } as Partial<ChildProps>,
    iconNode,
    ...(Children.map(children.props.children, (child) =>
      typeof child === "object" ? child : <span className={ns.e("text")}>{child}</span>
    ) || []),
    iconRightNode
  );
}
