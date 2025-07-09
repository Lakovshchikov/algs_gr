import { useRef, useEffect, useCallback } from "react";

export const useEventCallback = <F extends (...args: unknown[]) => any>(
  fn: F
): F => {
  const savedRef = useRef(fn);

  // всегда держим свежую функцию
  useEffect(() => {
    savedRef.current = fn;
  }, [fn]);

  const stableCallback = useCallback(
    (...args: Parameters<F>): ReturnType<F> => {
      return savedRef.current(...args);
    },
    []
  );

  return stableCallback as F;
};
