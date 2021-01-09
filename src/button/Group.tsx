import cx from "classnames";
import { FC } from "react";
import { Namespace } from "../helper";
import { IButtonSize } from "./Directive";

const ns = new Namespace("bgroup");
export interface IButtonGroupProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  radius?: IButtonSize | "round";
}
export const ButtonGroup: FC<IButtonGroupProps> = ({ className, ...props }) => (
  <div radius={props.radius} className={ns.cx({ [ns.m(props.radius!)]: !!props.radius }, className)} {...props}></div>
);
export default ButtonGroup;
