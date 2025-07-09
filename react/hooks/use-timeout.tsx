import { useCallback, useEffect, useMemo, useRef } from "react";

export const useTimeout = <F extends (...args: unknown[]) => void>(
  fn: F,
  delay: number
) => {
  const timeout = useRef<number | undefined>(undefined);

  const start = useCallback(() => {
    timeout.current = setTimeout(() => fn(), delay);
  }, [fn, delay]);

  const clear = useCallback(() => {
    clearTimeout(timeout.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    start();
  }, [start, clear]);

  useEffect(() => {
    reset();
  }, [reset]);

  return useMemo(
    () => ({
      clear,
      reset,
    }),
    [clear, reset]
  );
};
