import { createContext, useMemo } from "react";
// createContext 用于创建一个全局使用的属性，从而避免需要属性进行层层传递
export interface IDisabledProps {
  value?: boolean;
  chidlren: React.ReactNode;
}

export interface IDisabledContext {
  value: boolean;
}

export const DisabledContext = createContext<IDisabledContext>({ value: false });
//displayName 是为了React DevTools 使用该字符串来确定 context 要显示的内容。
DisabledContext.displayName = `DisabledContext`;

export const Disabled: React.FC<IDisabledProps> = ({ value = true, chidlren }) => {
  const ctx = useMemo(() => ({ value }), [value]);
  return <DisabledContext.Provider value={ctx}>{chidlren}</DisabledContext.Provider>;
};
