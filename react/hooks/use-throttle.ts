import { useCallback, useMemo, useRef } from "react";

export const useThrottle = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) => {
  const throttled = useRef<boolean>(false);
  const timeout = useRef<number | undefined>(undefined);

  const cancel = useCallback(() => {
    clearTimeout(timeout.current);
    throttled.current = false;
  }, []);

  const flush = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      fn(...args);
    },
    [fn, cancel]
  );

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      if (!throttled.current) {
        throttled.current = true;
        fn(...args);
        timeout.current = setTimeout(() => {
          throttled.current = false;
        }, delay);
      }
    },
    [delay, fn]
  );

  return useMemo(
    () => ({ cancel, flush, throttledFn }),
    [cancel, flush, throttledFn]
  );
};
