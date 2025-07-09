import { useCallback, useEffect, useMemo, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initial: T
): [T, (v: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const ls = localStorage.getItem(key);
    try {
      return ls ? JSON.parse(ls) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(JSON.parse(e.newValue || ""));
      }
    };

    addEventListener("storage", onStorage);

    return () => {
      removeEventListener("storage", onStorage);
    };
  }, [key]);

  useEffect(() => {
    const lsValue = localStorage.getItem(key);
    if (lsValue !== null) {
      setValue(JSON.parse(lsValue));
    }
  }, [key]);

  const saveValue = useCallback(
    (v: T) => {
      localStorage.setItem(key, JSON.stringify(v));
      setValue(v);
    },
    [key]
  );

  return useMemo(() => [value, saveValue], [value, saveValue]);
};
