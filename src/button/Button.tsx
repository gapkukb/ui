import { Component } from "react";
import { ButtonDirective, IButtonDirectiveProps } from "./Directive";
import ButtonGroup from "./Group";

export type IButtonProps = Partial<
  Omit<IButtonDirectiveProps<React.ButtonHTMLAttributes<HTMLButtonElement>>, "children"> &
    React.HtmlHTMLAttributes<HTMLElement> & {
      className: string;
      style: React.CSSProperties;
      href: string;
      target: string;
      htmlType: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
      download: string;
    }
>;

export class Button extends Component<Partial<IButtonProps>> {
  static defaultProps: IButtonProps = {
    type: "default",
    size: "md",
    htmlType: "button",
    bordered: true,
  };
  static Group = ButtonGroup;
  static Directive = ButtonDirective;
  render() {
    const {
      href,
      target,
      htmlType,
      type,
      size,
      block,
      disabled,
      loading,
      outline,
      bordered,
      icon,
      iconRight,
      children,
      download,
      ...props
    } = this.props;
    return (
      <ButtonDirective
        type={type}
        size={size}
        block={block}
        disabled={disabled}
        loading={loading}
        outline={outline}
        bordered={bordered}
        icon={icon}
        iconRight={iconRight}
      >
        {href || target ? (
          <a href={href || ""} target={target} download={download} {...props}>
            {children}
          </a>
        ) : (
          <button type={htmlType} {...props}>
            {children}
          </button>
        )}
      </ButtonDirective>
    );
  }
}

export default Button;
