import { useCallback, useEffect, useMemo, useRef } from "react";

export const useInterval = <F extends (...args: unknown[]) => void>(
  fn: F,
  delay: number
) => {
  const interval = useRef<number | undefined>(undefined);

  const start = useCallback(() => {
    interval.current = setInterval(() => fn(), delay);
  }, [fn, delay]);

  const clear = useCallback(() => {
    clearInterval(interval.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    start();
  }, [clear, start]);

  useEffect(() => {
    reset();
    return () => {
      clear();
    };
  }, [reset, clear]);

  return useMemo(
    () => ({
      clear,
      reset,
    }),
    [clear, reset]
  );
};
