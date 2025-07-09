import { useEffect, useRef } from "react";

export const usePrevious = <V>(value: V): V | undefined => {
  const prev = useRef<V | undefined>(undefined);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
};
