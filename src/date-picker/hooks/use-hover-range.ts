import { useEffect, useState } from "react";
import { DateNullTuple, DateTuple } from "../types";
/**
 * 根据选中的开始日期和hover日期，得到hover的日期范围
 * @param seleted 选中日期
 * @param hoverDate hover日期
 */
export default function useHoverRange(seleted: DateNullTuple, hoverDate?: Date) {
  const [range, set] = useState<DateTuple | null>(null);

  useEffect(() => {
    const [begin, end] = seleted;
    if (begin && !end && hoverDate) {
      set([begin, hoverDate]);
    } else {
      set(null);
    }
  }, [seleted, hoverDate]);

  return range;
}
