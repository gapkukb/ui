import { useState } from "react";
import { SingleDate } from "../types";

const current = new Date();
interface Props {
  format: string;
  value?: SingleDate;
  default?: SingleDate;
}
export default function useMergeProps({ format }: Props) {
  // 默认日期
  const [date, set] = useState(current);
  // 转换成date类型value日期，用于重置select
  // const parse = useMemo(()=>)
}
