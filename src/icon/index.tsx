import { forwardRef } from "react";
import { Namespace, unit } from "../helper";

const reg = /(\.(jpg|png|svg|gif|webp)$)|(^(http|data:image))/;
export interface IIconProps
  extends React.HTMLAttributes<HTMLElement>,
    Partial<{
      iconName: string;
      spin: boolean;
      prefix: string;
      badge: string | number | boolean;
      color: string;
      size: string;
      click: () => void;
    }> {
  name: string;
}
const ns = new Namespace("icon");
const Icon = forwardRef<HTMLElement, IIconProps>(
  ({ className, iconName, prefix, spin, name, badge, size, color, click, ...otherProps }, ref) => {
    const isImg = reg.test(name);
    return (
      <i
        ref={ref}
        onClick={click}
        style={{ fontSize: unit(size), color }}
        className={ns.cx(!isImg && prefix! + name, !isImg && iconName)}
        {...otherProps}
      >
        {isImg && <img className={ns.e("img")} src={name} />}
        {badge !== undefined && <span className={ns.e("badge")}>{badge}</span>}
      </i>
    );
  }
);
Icon.defaultProps = {
  iconName: "iconfont",
  prefix: "icon-",
};
Icon.displayName = "Icon";
export { Icon };
export default Icon;
