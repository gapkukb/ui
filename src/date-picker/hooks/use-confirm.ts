import { useState, useEffect } from "react";
import { parse } from "date-fns";
import { IDisabledTimeOption } from "../types";
// useState 返回一个数组，数组第一项是状态值，值是初始化的false，第二项是改变状态值的函数，改变后触发rerender
// 函数组件是无状态的，useState可为函数组件添加状态
// 多次调用可以添加多个状态，如果状态复杂使用reducer hook则更合适
// 初始化如果传入带返回值函，则只会在初始化的时候调用，更新不在调用，节省性能
// useEffect 副作用钩子 组件每次渲染更新后的回调（初始化也会执行一次）,第一个参数是函数，用以异步操作
// 第二个参数是数组，给出effect的依赖项，依赖项一旦变化就会触发副作用
interface IUseConfirm {
  format: string;
  selected: string;
  disabledTimeOption?: IDisabledTimeOption;
}

//自定义确认钩子
export default function useConfirm({ disabledTimeOption, selected, format }: IUseConfirm) {
  const [state, set] = useState(false);
  useEffect(() => {
    const date = parse(selected, format, new Date());
    const hour = date.getHours();
    const minute = date.getMinutes();

    const disabledHour = () => disabledTimeOption?.disabledHours?.().includes(hour)!;
    const disabeldMinute = () => disabledTimeOption?.disabledMinutes?.(hour).includes(minute)!;
    const disabledSecond = () => disabledTimeOption?.disabledSeconds?.(hour, minute).includes(date.getSeconds())!;

    set(!selected || disabledHour() || disabeldMinute() || disabledSecond());
  }, [selected, format, disabledTimeOption]);

  return state;
}
