type Tuple<T, N extends number> = {
  0: T;
  length: N;
} & ReadonlyArray<T>;
