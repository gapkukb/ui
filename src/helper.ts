import cx from "classnames";
import { ClassValue } from "classnames/types";
import { CSSProperties, ReactNode } from "react";
import { namespace } from "./config.json";

export { cx };
export class Namespace {
  private static readonly prefix = namespace;
  private static readonly mSymbol = "--";
  private static readonly eSymbol = "__";
  readonly b!: string;
  constructor(name: string) {
    if (name.startsWith(Namespace.prefix)) {
      this.b = name;
      return;
    }
    this.b = Namespace.prefix + name;
  }
  private create(symbol: string, name: string, classNames: (string | undefined)[]): string {
    return (this.b + symbol + name + " " + classNames.join(" ")).trimEnd();
  }
  m(name: string, ...classNames: (string | undefined)[]): string {
    return this.create(Namespace.mSymbol, name, classNames);
  }
  e(name: string, ...classNames: (string | undefined)[]): string {
    return this.create(Namespace.eSymbol, name, classNames);
  }
  new(element: string): Namespace {
    return new Namespace(this.e(element));
  }
  cx(...classes: ClassValue[]) {
    return cx(this.b, classes);
  }
  displayName(component: any) {
    component.displayName = this.b;
  }
}

export type IBaseProps = Partial<{
  className: string;
  style: CSSProperties;
  children: ReactNode;
}>;
export const pagerCtrl = {
  PREV: -1, //向前翻页
  NEXT: -2, //向后翻页
  UP: -3, // 双向前翻页
  DOWN: -4, //双向后翻页
};

export function makePager(current: number, pages: number = 1, max: number = 10): number[] {
  const MID = Math.ceil(max / 2);
  const begin =
    pages <= max || current <= MID ? 1 : current >= pages - MID ? pages - max + 1 : current - (max - MID) + 1;
  let ret: number[] = new Array(Math.min(max, pages)).fill(begin).map((i, ii) => i + ii);

  if (pages > max) {
    if (current > MID) {
      ret.splice(0, 2);
      ret.unshift(pagerCtrl.UP);
      ret.unshift(1);
    }
    if (current < pages - MID) {
      ret.splice(ret.length - 2, 2);
      ret.push(pagerCtrl.DOWN);
      ret.push(pages);
    }
  }
  ret.unshift(pagerCtrl.PREV);
  ret.push(pagerCtrl.NEXT);
  return ret;
}

export function unit(input: any, unit: string = "px"): string {
  //自动填充单位
  const value = input + unit;
  if (typeof input === "number") return value;
  if (typeof input === "string") return Number(input) ? value : input;
  return "";
}

const reg = /^(\d*\.?\d+)(\D+)?/;

export function getUnit(input: any): { value: number; unit: string } {
  input += "";
  const matched = input.match(reg);
  const value = matched ? Number(matched[1]) : 0;
  const unit = matched ? matched[2] || "px" : "px";
  return { unit, value };
}
