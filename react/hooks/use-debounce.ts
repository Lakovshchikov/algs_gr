import { useCallback, useRef } from "react";

type UseDebounceReturn<Args extends unknown[]> = {
  debounced: (...args: Args) => void;
  cancel: () => void;
  flush: (...args: Args) => void;
};

export function useDebounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): UseDebounceReturn<Args> {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timeout.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay, cancel]
  );

  const flush = useCallback(
    (...args: Args) => {
      cancel();
      fn(...args);
    },
    [fn, cancel]
  );

  return { debounced, cancel, flush };
}

const TestComponent = () => {
  const fn = useCallback((a: number) => a++, []);
  useDebounce(fn, 500);
};
