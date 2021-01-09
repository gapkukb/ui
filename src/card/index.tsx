import { Component, ReactNode, CSSProperties } from "react";
import { Namespace, IBaseProps } from "../helper";

const ns = new Namespace("card");
export type ICardProps = IBaseProps &
  Partial<{
    type: "normal" | "nested";
    header: ReactNode;
    headerClass: string;
    headerStyle: CSSProperties;
    bodyStyle: CSSProperties;
    bodyClass: string;
    footer: ReactNode;
    footerStyle: CSSProperties;
    footerClass: string;
    loading: boolean;
    headerSlot: ReactNode;
    footerSlot: ReactNode;
    action: ReactNode;
  }>;
export class Card extends Component<ICardProps> {
  static defaultProps: ICardProps = {
    type: "normal",
    style: {},
    headerStyle: {},
    bodyStyle: {},
    className: "",
  };

  render() {
    const {
      className,
      style,
      header,
      type,
      loading,
      children,
      bodyStyle,
      bodyClass,
      headerClass,
      headerStyle,
      footer,
      footerClass,
      footerStyle,
      headerSlot,
      footerSlot,
      action,
    } = this.props;

    return (
      <div className={ns.cx(ns.m(type!), {}, className)} style={style}>
        {headerSlot
          ? headerSlot
          : header && (
              <div className={ns.e("header", headerClass)} style={headerStyle}>
                {header}
                {action}
              </div>
            )}
        <div className={(ns.e("body"), bodyClass)} style={bodyStyle}>
          {loading ? `loading` : children}
        </div>
        {footerSlot
          ? footerSlot
          : footer && (
              <div className={ns.e("footer", footerClass)} style={footerStyle}>
                {footer}
              </div>
            )}
      </div>
    );
  }
}

export default Card;
